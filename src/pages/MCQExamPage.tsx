import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { MCQQuestion, MCQAttempt } from '../types.ts';
import { useToast } from '../components/common/Toast.tsx';
import {
  Clock,
  ShieldAlert,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  Award,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface MCQExamPageProps {
  onNavigate: (path: string) => void;
}

export const MCQExamPage: React.FC<MCQExamPageProps> = ({ onNavigate }) => {
  const { participant } = useAuth();
  const { success, error, warning } = useToast();

  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [attempt, setAttempt] = useState<MCQAttempt | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [remainingSeconds, setRemainingSeconds] = useState<number>(1800); // default 30 mins
  const [loading, setLoading] = useState(true);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [violationAlert, setViolationAlert] = useState<{ message: string; strikes: number } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastViolationTime = useRef<number>(0);

  // 1. Initial Load & Start Attempt
  useEffect(() => {
    let isMounted = true;

    async function initExam() {
      try {
        const qData = await api.getMCQQuestions();
        if (!isMounted) return;
        setQuestions(qData.questions);

        // Start or resume
        const startRes = await api.startMCQ();
        if (!isMounted) return;

        setAttempt(startRes.attempt);
        setAnswers(startRes.attempt.answers || {});
        setRemainingSeconds(startRes.remaining_seconds);

        if (startRes.attempt.status === 'submitted' || startRes.expired) {
          setIsSubmitted(true);
          setSubmissionResult({
            score: startRes.attempt.score,
            total_questions: startRes.attempt.total_questions,
            percentage: startRes.attempt.percentage,
            is_auto_submitted: startRes.attempt.is_auto_submitted,
          });
        }
      } catch (err: any) {
        error('Failed to launch exam', err.message);
        onNavigate('/dashboard');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initExam();

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 2. Authoritative Timer Interval
  useEffect(() => {
    if (isSubmitted || loading) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAutoSubmit('Time Expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSubmitted, loading]);

  // Periodic Authoritative Server Sync every 30 seconds
  useEffect(() => {
    if (isSubmitted || loading) return;

    const syncInterval = setInterval(async () => {
      try {
        const status = await api.getMCQStatus();
        if (status.status === 'submitted') {
          handleAutoSubmit('Exam closed on server');
        } else if (status.remaining_seconds) {
          setRemainingSeconds(status.remaining_seconds);
        }
      } catch (err) {
        // silent sync error
      }
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [isSubmitted, loading]);

  // 3. Anti-Tab Switch / Window Blur Detection
  useEffect(() => {
    if (isSubmitted || loading) return;

    const reportViolation = async (violationType: string) => {
      const now = Date.now();
      // Debounce events within 2 seconds
      if (now - lastViolationTime.current < 2000) return;
      lastViolationTime.current = now;

      try {
        const res = await api.recordViolation(violationType);
        setViolationAlert({
          message: res.warning,
          strikes: res.violations_count,
        });

        if (res.auto_submitted) {
          setIsSubmitted(true);
          const finalAttempt = await api.getMCQStatus();
          setSubmissionResult({
            score: finalAttempt.attempted,
            total_questions: 25,
            percentage: 0,
            is_auto_submitted: true,
          });
        }
      } catch (err) {
        console.warn('Violation reporting error:', err);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation('tab_hidden');
      }
    };

    const handleWindowBlur = () => {
      reportViolation('window_blur');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isSubmitted, loading]);

  // Answer selection handler
  const handleSelectOption = async (option: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted || !currentQ) return;

    const qId = currentQ.id;
    const newAnswers = { ...answers, [qId]: option };
    setAnswers(newAnswers);

    setSavingAnswer(true);
    try {
      await api.saveMCQAnswer(qId, option);
    } catch (err: any) {
      warning('Auto-save delayed', 'Could not sync answer immediately with server.');
    } finally {
      setSavingAnswer(false);
    }
  };

  const handleFinalSubmit = async () => {
    setShowSubmitConfirm(false);
    setLoading(true);
    try {
      const res = await api.submitMCQ();
      setIsSubmitted(true);
      setSubmissionResult(res);
      success('Round 1 Submitted!', `You scored ${res.score} out of ${res.total_questions}`);
    } catch (err: any) {
      error('Submission Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = async (reason: string) => {
    try {
      const res = await api.submitMCQ();
      setIsSubmitted(true);
      setSubmissionResult(res);
      warning('Test Auto-Submitted', `Exam was submitted due to: ${reason}`);
    } catch (err) {
      setIsSubmitted(true);
    }
  };

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading && !submissionResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#0878FF] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-[#7F8DA3]">Loading Round 1 MCQ arena...</p>
      </div>
    );
  }

  // POST SUBMISSION RESULT SCREEN
  if (isSubmitted && submissionResult) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
          <Award className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white">
            Round 01 Submitted!
          </h2>
          <p className="text-xs sm:text-sm text-[#7F8DA3]">
            Your responses have been securely scored and logged in the official Vel Tech Code Masters record.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#07111F] border border-[#1E293B] shadow-2xl space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00C8FF]">
              Official Result
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">EVALUATED</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0F1C34] border border-[#1E293B]">
              <span className="text-xs text-[#7F8DA3]">Raw Score</span>
              <p className="text-3xl font-mono font-extrabold text-white mt-1">
                {submissionResult.score} <span className="text-base text-[#7F8DA3]">/ {submissionResult.total_questions || 25}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0F1C34] border border-[#1E293B]">
              <span className="text-xs text-[#7F8DA3]">Accuracy</span>
              <p className="text-3xl font-mono font-extrabold text-[#00C8FF] mt-1">
                {submissionResult.percentage}%
              </p>
            </div>
          </div>

          {submissionResult.is_auto_submitted && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              Exam was automatically finalized by system policy.
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0878FF] to-[#00C8FF] shadow-[0_0_20px_rgba(8,120,255,0.4)]"
          >
            Return to Participant Portal
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isUrgent = remainingSeconds < 300; // Under 5 mins

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Violation Alert Banner if triggered */}
      {violationAlert && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-500 shadow-2xl flex items-start justify-between gap-4 text-white animate-bounce">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-200">
                PROCTORING ALERT: Window Focus Lost (Strike {violationAlert.strikes}/3)
              </h4>
              <p className="text-xs text-rose-300/90 mt-0.5">{violationAlert.message}</p>
            </div>
          </div>
          <button
            onClick={() => setViolationAlert(null)}
            className="px-3 py-1 rounded-lg bg-rose-900 text-xs font-bold hover:bg-rose-800"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Exam Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#07111F] border border-[#1E293B] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00C8FF]">
            <span>ROUND 01</span>
            <span>•</span>
            <span>PYTHON MCQ CHALLENGE</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            Question {currentIndex + 1} of {questions.length}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Answered Counter */}
          <div className="text-xs text-[#7F8DA3] hidden md:block">
            Answered: <strong className="text-white font-mono">{answeredCount}</strong> / {questions.length}
          </div>

          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm sm:text-base ${
              isUrgent
                ? 'bg-rose-500/20 text-rose-400 border-rose-500 animate-pulse'
                : 'bg-[#0F1C34] text-[#00C8FF] border-[#0878FF]/50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Two-Column Exam Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Question & Options (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {currentQ ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#07111F] border border-[#1E293B] shadow-xl space-y-6">
              {/* Question metadata badge */}
              <div className="flex items-center justify-between text-xs text-[#7F8DA3]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0F1C34] border border-[#1E293B] text-[#00C8FF] font-semibold">
                    {currentQ.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0F1C34] border border-[#1E293B] text-white">
                    {currentQ.difficulty}
                  </span>
                </div>
                <span className="font-mono text-[#00C8FF]">1 Mark</span>
              </div>

              {/* Question text */}
              <h2 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                {currentQ.question}
              </h2>

              {/* Code Snippet if present */}
              {currentQ.code_snippet && (
                <div className="rounded-xl overflow-hidden border border-[#1E293B] bg-[#050B14]">
                  <div className="bg-[#0F1C34] px-4 py-1.5 border-b border-[#1E293B] flex items-center justify-between text-[11px] font-mono text-[#7F8DA3]">
                    <span>python3</span>
                    <span>snippet</span>
                  </div>
                  <pre className="p-4 font-mono text-xs text-[#00C8FF] overflow-x-auto leading-relaxed">
                    <code>{currentQ.code_snippet}</code>
                  </pre>
                </div>
              )}

              {/* 4 Interactive Options */}
              <div className="space-y-3 pt-2">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                  const key = `option_${opt.toLowerCase()}` as keyof MCQQuestion;
                  const optionText = currentQ[key] as string;
                  const isSelected = answers[currentQ.id] === opt;

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-[#0878FF]/20 border-[#0878FF] text-white shadow-[0_0_15px_rgba(8,120,255,0.25)]'
                          : 'bg-[#0F1C34]/70 border-[#1E293B] text-[#D9E2F0] hover:bg-[#0F1C34] hover:border-[#0878FF]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-[#0878FF] text-white'
                              : 'bg-[#07111F] text-[#7F8DA3] group-hover:text-white border border-[#1E293B]'
                          }`}
                        >
                          {opt}
                        </span>
                        <span className="leading-snug">{optionText}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#00C8FF] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-[#1E293B]">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#D9E2F0] hover:text-white bg-[#0F1C34] border border-[#1E293B] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <span className="text-xs text-[#7F8DA3] font-mono">
                  {currentIndex + 1} / {questions.length}
                </span>

                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIndex === questions.length - 1}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0878FF] hover:bg-[#0878FF]/90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#7F8DA3] text-sm bg-[#07111F] rounded-3xl border border-[#1E293B]">
              No question found.
            </div>
          )}
        </div>

        {/* Right Column: Question Navigator Palette (1 col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#07111F] border border-[#1E293B] shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Question Navigator
            </h3>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[11px] text-[#7F8DA3] pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#0878FF]" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#0F1C34] border border-[#1E293B]" />
                <span>Pending</span>
              </div>
            </div>

            {/* Palette Grid */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl font-mono text-xs font-bold transition-all ${
                      isCurrent
                        ? 'ring-2 ring-[#00C8FF] bg-[#0878FF] text-white shadow-[0_0_10px_rgba(0,200,255,0.4)]'
                        : isAnswered
                        ? 'bg-[#0878FF]/30 text-[#00C8FF] border border-[#0878FF]/50'
                        : 'bg-[#0F1C34] text-[#7F8DA3] hover:text-white border border-[#1E293B]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#1E293B] text-xs text-[#7F8DA3] leading-relaxed">
              Anti-cheat logging is active. Do not switch tabs or minimize this window.
            </div>
          </div>
        </div>
      </div>

      {/* Final Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#07111F] border border-[#0878FF]/50 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-[#0878FF]/20 text-[#00C8FF] flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Finalize Round 1 Submission?</h3>
              <p className="text-xs text-[#7F8DA3] leading-relaxed">
                You have answered <strong className="text-white">{answeredCount}</strong> of{' '}
                <strong className="text-white">{questions.length}</strong> questions. Once submitted, you cannot change your answers.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-3 rounded-xl text-xs font-semibold text-[#D9E2F0] hover:text-white bg-[#0F1C34] border border-[#1E293B]"
              >
                Continue Test
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

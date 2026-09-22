import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { api } from '../services/api.ts';
import { DebuggingProblem, DebuggingSubmission } from '../types.ts';
import { useToast } from '../components/common/Toast.tsx';
import {
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileCode2,
  Terminal,
  History,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface DebuggingArenaProps {
  onNavigate: (path: string) => void;
}

export const DebuggingArenaPage: React.FC<DebuggingArenaProps> = ({ onNavigate }) => {
  const { success, error, warning, info } = useToast();

  const [problems, setProblems] = useState<DebuggingProblem[]>([]);
  const [submissions, setSubmissions] = useState<DebuggingSubmission[]>([]);
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Execution states
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResults, setRunResults] = useState<any>(null);
  const [submissionFeedback, setSubmissionFeedback] = useState<any>(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'run' | 'submit' | 'history'>('run');

  useEffect(() => {
    async function loadArena() {
      try {
        const res = await api.getDebuggingProblems();
        setProblems(res.problems);
        setSubmissions(res.submissions || []);
        if (res.problems.length > 0) {
          setCode(res.problems[0].starter_code);
        }
      } catch (err: any) {
        error('Failed to load debugging problems', err.message);
        onNavigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadArena();
  }, []);

  const currentProblem = problems[selectedProblemIndex];

  const handleSelectProblem = (index: number) => {
    setSelectedProblemIndex(index);
    setCode(problems[index].starter_code);
    setRunResults(null);
    setSubmissionFeedback(null);
    setActiveConsoleTab('run');
  };

  const handleResetCode = () => {
    if (currentProblem) {
      setCode(currentProblem.starter_code);
      info('Code reset to original starter template.');
    }
  };

  // Run visible tests only
  const handleRunCode = async () => {
    if (!currentProblem || running || submitting) return;

    setRunning(true);
    setActiveConsoleTab('run');
    setRunResults(null);

    try {
      const res = await api.runDebuggingCode(currentProblem.id, code);
      setRunResults(res);
      if (res.all_passed) {
        success('Visible test cases passed!', 'Ready to submit solution for hidden evaluation.');
      } else {
        warning('Some visible tests failed', 'Inspect the outputs and diagnose the logic defect.');
      }
    } catch (err: any) {
      error('Execution Engine Error', err.message);
    } finally {
      setRunning(false);
    }
  };

  // Submit against hidden test cases
  const handleSubmitCode = async () => {
    if (!currentProblem || running || submitting) return;

    setSubmitting(true);
    setActiveConsoleTab('submit');
    setSubmissionFeedback(null);

    try {
      const res = await api.submitDebuggingCode(currentProblem.id, code);
      setSubmissionFeedback(res);
      setSubmissions((prev) => [res.submission, ...prev]);

      if (res.status === 'Accepted') {
        success('Problem Accepted!', `Earned full score: ${res.score} marks!`);
      } else {
        warning(`Verdict: ${res.status}`, `Score: ${res.score} marks (${res.total_passed}/${res.total_tests} passed)`);
      }
    } catch (err: any) {
      error('Submission Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#0878FF] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-[#7F8DA3]">Booting Python Debugging Arena & Sandboxes...</p>
      </div>
    );
  }

  const currentProblemSubmissions = submissions.filter(
    (s) => currentProblem && s.problem_id === currentProblem.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Problem Selector Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#07111F] border border-[#1E293B] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {problems.map((p, idx) => {
            const isSelected = idx === selectedProblemIndex;
            const isSolved = submissions.some((s) => s.problem_id === p.id && s.status === 'Accepted');

            return (
              <button
                key={p.id}
                onClick={() => handleSelectProblem(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#0878FF] text-white shadow-[0_0_12px_rgba(8,120,255,0.3)]'
                    : 'bg-[#0F1C34] text-[#7F8DA3] hover:text-white border border-[#1E293B]'
                }`}
              >
                <span>Problem {idx + 1}</span>
                {isSolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-[#00C8FF]">{p.marks}m</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="text-[#7F8DA3] hover:text-white font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Problem Info vs Right Editor + Bottom Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Problem Specification (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {currentProblem && (
            <div className="p-6 rounded-3xl bg-[#07111F] border border-[#1E293B] shadow-xl space-y-6 max-h-[820px] overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0878FF]/20 border border-[#0878FF]/40 text-[#00C8FF]">
                    {currentProblem.difficulty}
                  </span>
                  <span className="text-[#7F8DA3]">Max Marks: {currentProblem.marks}</span>
                  <span className="text-[#7F8DA3]">•</span>
                  <span className="text-[#7F8DA3]">Timeout: {currentProblem.time_limit_sec}s</span>
                </div>
                <h1 className="text-xl font-bold text-white leading-tight">
                  {currentProblem.title}
                </h1>
              </div>

              {/* Description */}
              <div className="space-y-2 text-xs sm:text-sm text-[#D9E2F0]/90 leading-relaxed border-t border-[#1E293B] pt-4">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#00C8FF]">
                  Problem Description
                </h4>
                <p>{currentProblem.description}</p>
              </div>

              {/* Input / Output Format */}
              <div className="grid grid-cols-1 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#0F1C34] border border-[#1E293B]">
                  <span className="font-bold text-[#00C8FF] block mb-1">Input Format</span>
                  <p className="text-[#D9E2F0] font-mono text-[11px]">{currentProblem.input_format}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0F1C34] border border-[#1E293B]">
                  <span className="font-bold text-[#00C8FF] block mb-1">Output Format</span>
                  <p className="text-[#D9E2F0] font-mono text-[11px]">{currentProblem.output_format}</p>
                </div>
              </div>

              {/* Constraints */}
              {currentProblem.constraints && (
                <div className="space-y-1.5 text-xs text-[#7F8DA3]">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Constraints
                  </h4>
                  <pre className="p-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] font-mono text-[11px] text-[#D9E2F0]">
                    {currentProblem.constraints}
                  </pre>
                </div>
              )}

              {/* Visible Test Cases */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#00C8FF]">
                  Visible Sample Cases
                </h4>
                {currentProblem.visible_examples.map((ex, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#050B14] border border-[#1E293B] space-y-2 text-xs">
                    <div className="flex justify-between font-mono text-[11px] text-[#7F8DA3]">
                      <span>Example #{idx + 1}</span>
                    </div>
                    <div>
                      <span className="text-[#7F8DA3] block text-[10px]">Input:</span>
                      <pre className="font-mono text-white text-xs bg-[#0F1C34] p-1.5 rounded mt-0.5">{ex.input}</pre>
                    </div>
                    <div>
                      <span className="text-[#7F8DA3] block text-[10px]">Expected Output:</span>
                      <pre className="font-mono text-emerald-400 text-xs bg-[#0F1C34] p-1.5 rounded mt-0.5">{ex.output}</pre>
                    </div>
                    {ex.explanation && (
                      <p className="text-[#7F8DA3] text-[11px] italic">Explanation: {ex.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Code Editor + Execution Console (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Monaco Editor Container */}
          <div className="rounded-3xl bg-[#07111F] border border-[#1E293B] shadow-2xl overflow-hidden">
            {/* Editor Toolbar */}
            <div className="px-5 py-3 bg-[#0F1C34] border-b border-[#1E293B] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D9E2F0]">
                <FileCode2 className="w-4 h-4 text-[#00C8FF]" />
                <span className="font-bold text-white">solution.py</span>
                <span className="text-[#7F8DA3]">• Python 3.10 Sandbox</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#7F8DA3] hover:text-white hover:bg-[#1E293B] flex items-center gap-1.5 transition-all"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Monaco Component */}
            <div className="h-[380px] w-full">
              <Editor
                height="100%"
                defaultLanguage="python"
                language="python"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, Menlo, Monaco, monospace',
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  wordWrap: 'on',
                }}
              />
            </div>

            {/* Action Buttons Bar */}
            <div className="p-4 bg-[#0F1C34] border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#7F8DA3]">
                <Clock className="w-3.5 h-3.5" />
                <span>3s CPU Execution Limit</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunCode}
                  disabled={running || submitting}
                  className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#0F1C34] hover:bg-[#1E293B] border border-[#0878FF]/40 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 text-[#00C8FF]" />
                  {running ? 'Executing...' : 'Run Visible Tests'}
                </button>

                <button
                  onClick={handleSubmitCode}
                  disabled={running || submitting}
                  className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#0878FF] to-[#00C8FF] hover:brightness-110 shadow-[0_0_15px_rgba(8,120,255,0.4)] flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Evaluating...' : 'Submit Solution'}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Execution Console */}
          <div className="rounded-3xl bg-[#07111F] border border-[#1E293B] shadow-xl overflow-hidden">
            {/* Console Tabs */}
            <div className="px-4 pt-3 bg-[#0F1C34] border-b border-[#1E293B] flex items-center gap-2">
              <button
                onClick={() => setActiveConsoleTab('run')}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeConsoleTab === 'run'
                    ? 'border-[#00C8FF] text-[#00C8FF]'
                    : 'border-transparent text-[#7F8DA3] hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Visible Test Results
              </button>

              <button
                onClick={() => setActiveConsoleTab('submit')}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeConsoleTab === 'submit'
                    ? 'border-[#0878FF] text-white'
                    : 'border-transparent text-[#7F8DA3] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Submission Verdict
              </button>

              <button
                onClick={() => setActiveConsoleTab('history')}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeConsoleTab === 'history'
                    ? 'border-[#FFB800] text-[#FFB800]'
                    : 'border-transparent text-[#7F8DA3] hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Submissions ({currentProblemSubmissions.length})
              </button>
            </div>

            {/* Tab 1: Run Visible Tests */}
            {activeConsoleTab === 'run' && (
              <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto font-mono text-xs">
                {runResults ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                      <span className="text-[#7F8DA3]">Passed:</span>
                      <span className={runResults.all_passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {runResults.passed_count} / {runResults.total_tests} Tests Passed
                      </span>
                    </div>

                    {runResults.test_results.map((r: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          r.passed
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                        } space-y-1.5`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">Test Case #{idx + 1}</span>
                          <span className="text-[11px]">{r.passed ? 'PASSED' : 'FAILED'} ({r.executionTimeMs}ms)</span>
                        </div>
                        <div>
                          <span className="text-[#7F8DA3] block text-[10px]">Input:</span>
                          <span className="text-white">{r.input}</span>
                        </div>
                        <div>
                          <span className="text-[#7F8DA3] block text-[10px]">Expected:</span>
                          <span className="text-emerald-400">{r.expectedOutput}</span>
                        </div>
                        <div>
                          <span className="text-[#7F8DA3] block text-[10px]">Your Output:</span>
                          <span className={r.passed ? 'text-emerald-400' : 'text-rose-400'}>{r.actualOutput || '<empty>'}</span>
                        </div>
                        {r.errorMessage && (
                          <div className="text-rose-400 text-[11px] pt-1">
                            Error: {r.errorMessage}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#7F8DA3] py-4 text-center">
                    Click "Run Visible Tests" above to execute your code against sample inputs.
                  </p>
                )}
              </div>
            )}

            {/* Tab 2: Submission Verdict */}
            {activeConsoleTab === 'submit' && (
              <div className="p-4 space-y-4 max-h-[320px] overflow-y-auto text-xs">
                {submissionFeedback ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#0F1C34] border border-[#1E293B] flex items-center justify-between">
                      <div>
                        <span className="text-[#7F8DA3] block text-[11px]">Verdict:</span>
                        <h3
                          className={`text-xl font-bold ${
                            submissionFeedback.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {submissionFeedback.status}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[#7F8DA3] block text-[11px]">Score Earned:</span>
                        <p className="text-2xl font-bold font-mono text-white">
                          {submissionFeedback.score} <span className="text-xs text-[#7F8DA3]">/ {currentProblem?.marks}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-[#050B14] border border-[#1E293B]">
                        <span className="text-[#7F8DA3] text-[10px]">Total Tests Passed</span>
                        <p className="text-base font-bold text-white mt-1">
                          {submissionFeedback.total_passed} / {submissionFeedback.total_tests}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-[#050B14] border border-[#1E293B]">
                        <span className="text-[#7F8DA3] text-[10px]">Remaining Attempts</span>
                        <p className="text-base font-bold text-[#00C8FF] mt-1">
                          {submissionFeedback.remaining_submissions} left
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#7F8DA3] py-4 text-center">
                    Click "Submit Solution" to run your program against all hidden automated evaluation test suites.
                  </p>
                )}
              </div>
            )}

            {/* Tab 3: History */}
            {activeConsoleTab === 'history' && (
              <div className="p-4 space-y-2 max-h-[320px] overflow-y-auto text-xs">
                {currentProblemSubmissions.length === 0 ? (
                  <p className="text-[#7F8DA3] py-4 text-center">
                    No submissions recorded yet for this problem.
                  </p>
                ) : (
                  currentProblemSubmissions.map((sub, idx) => (
                    <div
                      key={sub.id || idx}
                      className="p-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span
                          className={`font-bold ${
                            sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {sub.status}
                        </span>
                        <p className="text-[11px] text-[#7F8DA3]">
                          {new Date(sub.submitted_at).toLocaleTimeString()} • {sub.execution_time_ms}ms
                        </p>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-white font-bold">{sub.score} Pts</span>
                        <p className="text-[10px] text-[#7F8DA3]">
                          {sub.passed_visible + sub.passed_hidden} passed
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

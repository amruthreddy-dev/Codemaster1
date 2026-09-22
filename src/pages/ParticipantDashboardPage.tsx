import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { ParticipantDashboardData } from '../types.ts';
import { useToast } from '../components/common/Toast.tsx';
import {
  BrainCircuit,
  Bug,
  Presentation,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  User,
  Users,
  Award,
  RefreshCw,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const ParticipantDashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { participant, user } = useAuth();
  const { error } = useToast();

  const [data, setData] = useState<ParticipantDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.getParticipantDashboard();
      setData(res);
    } catch (err: any) {
      error('Failed to load dashboard', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#0878FF] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-[#7F8DA3]">Synchronizing candidate dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-rose-400 text-sm">Failed to retrieve participant data.</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 rounded-xl bg-[#0F1C34] text-[#00C8FF] text-xs font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  const p = data.participant;
  const { round1, round2, round3 } = data.rounds;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F1C34] via-[#07111F] to-[#0A1628] border border-[#0878FF]/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#0878FF]/20 border border-[#0878FF]/50 text-[#00C8FF] text-xs font-mono font-bold">
                PARTICIPANT ID: {p.id}
              </span>
              {data.violations_count > 0 && (
                <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {data.violations_count} Strike{data.violations_count > 1 ? 's' : ''} Recorded
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Welcome, {p.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-[#D9E2F0]">
              Team <strong className="text-white font-semibold">{p.team_name}</strong> • {p.department} ({p.year})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={fetchDashboard}
              className="p-3 rounded-xl bg-[#07111F] text-[#7F8DA3] hover:text-white border border-[#1E293B] transition-all"
              title="Refresh Dashboard"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="p-3.5 rounded-2xl bg-[#07111F] border border-[#1E293B] text-xs space-y-1 min-w-[200px]">
              <div className="flex justify-between text-[#7F8DA3]">
                <span>Student ID:</span>
                <span className="text-white font-mono">{p.register_number}</span>
              </div>
              <div className="flex justify-between text-[#7F8DA3]">
                <span>Team Members:</span>
                <span className="text-white">{p.team_members.length + 1} Coder{p.team_members.length > 0 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THREE ROUNDS STATUS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ROUND 1: MCQ */}
        <div className="p-6 rounded-3xl bg-[#07111F] border border-[#1E293B] hover:border-[#0878FF]/50 transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#0F1C34] text-[#00C8FF] border border-[#0878FF]/40 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6" />
              </div>
              {round1.status === 'completed' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Completed
                </span>
              )}
              {round1.status === 'in_progress' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                  In Progress
                </span>
              )}
              {round1.status === 'available' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0878FF]/20 text-[#00C8FF] border border-[#0878FF]/40">
                  Ready to Start
                </span>
              )}
              {round1.status === 'locked' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#1E293B] text-[#7F8DA3] flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Locked by Admin
                </span>
              )}
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#00C8FF]">Round 01</span>
              <h3 className="text-xl font-bold text-white mt-0.5">MCQ Challenge</h3>
              <p className="text-xs text-[#7F8DA3] mt-1">
                25 Python Questions • 30 Minutes
              </p>
            </div>

            {round1.status === 'completed' && round1.attempt && (
              <div className="p-4 rounded-xl bg-[#0F1C34] border border-[#1E293B] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#7F8DA3]">Raw Score:</span>
                  <span className="text-emerald-400 font-mono font-bold text-base">
                    {round1.attempt.score} / {round1.total_questions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#7F8DA3]">Accuracy:</span>
                  <span className="text-white font-mono font-bold">
                    {round1.attempt.percentage}%
                  </span>
                </div>
                {round1.attempt.is_auto_submitted && (
                  <p className="text-[11px] text-rose-400 font-medium pt-1">
                    Auto-submitted due to timer or window focus violation.
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            {round1.status === 'available' && (
              <button
                onClick={() => onNavigate('/mcq')}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#0878FF] to-[#00C8FF] hover:brightness-110 shadow-[0_0_15px_rgba(8,120,255,0.4)] flex items-center justify-center gap-2"
              >
                Start MCQ Challenge (30m)
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {round1.status === 'in_progress' && (
              <button
                onClick={() => onNavigate('/mcq')}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-amber-500 hover:brightness-110 flex items-center justify-center gap-2"
              >
                Resume Active Exam
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {round1.status === 'completed' && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Submitted & Evaluated
              </div>
            )}
            {round1.status === 'locked' && (
              <button
                disabled
                className="w-full py-3 rounded-xl text-xs font-semibold text-[#7F8DA3] bg-[#0F1C34] border border-[#1E293B] cursor-not-allowed"
              >
                Awaiting Organizer Activation
              </button>
            )}
          </div>
        </div>

        {/* ROUND 2: DEBUGGING */}
        <div className="p-6 rounded-3xl bg-[#07111F] border border-[#1E293B] hover:border-[#0878FF]/50 transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#0F1C34] text-[#00C8FF] border border-[#0878FF]/40 flex items-center justify-center">
                <Bug className="w-6 h-6" />
              </div>
              {round2.status === 'completed' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  All Submitted
                </span>
              )}
              {round2.status === 'in_progress' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  Solving Active
                </span>
              )}
              {round2.status === 'available' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0878FF]/20 text-[#00C8FF] border border-[#0878FF]/40">
                  Arena Unlocked
                </span>
              )}
              {round2.status === 'locked' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#1E293B] text-[#7F8DA3] flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Round Locked
                </span>
              )}
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#00C8FF]">Round 02</span>
              <h3 className="text-xl font-bold text-white mt-0.5">Python Debugging Arena</h3>
              <p className="text-xs text-[#7F8DA3] mt-1">
                5 Programs • 45 Minutes • Monaco IDE
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0F1C34] border border-[#1E293B] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#7F8DA3]">Problems Solved:</span>
                <span className="text-[#00C8FF] font-mono font-bold">
                  {round2.solved_problems_count} / {round2.total_problems}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7F8DA3]">Submissions Recorded:</span>
                <span className="text-white font-mono font-bold">
                  {round2.submissions_count}
                </span>
              </div>
            </div>
          </div>

          <div>
            {round2.status !== 'locked' ? (
              <button
                onClick={() => onNavigate('/debugging')}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#0878FF] to-[#00C8FF] hover:brightness-110 shadow-[0_0_15px_rgba(8,120,255,0.4)] flex items-center justify-center gap-2"
              >
                Enter Debugging Arena
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 rounded-xl text-xs font-semibold text-[#7F8DA3] bg-[#0F1C34] border border-[#1E293B] cursor-not-allowed"
              >
                Locked (Opens after Round 1)
              </button>
            )}
          </div>
        </div>

        {/* ROUND 3: PRESENTATION */}
        <div className="p-6 rounded-3xl bg-[#07111F] border border-[#1E293B] hover:border-[#FFB800]/50 transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#0F1C34] text-[#FFB800] border border-[#FFB800]/40 flex items-center justify-center">
                <Presentation className="w-6 h-6" />
              </div>
              {round3.is_qualified ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40">
                  Qualified for Finals!
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#1E293B] text-[#7F8DA3]">
                  Shortlist Pending
                </span>
              )}
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFB800]">Round 03</span>
              <h3 className="text-xl font-bold text-white mt-0.5">Final Presentation</h3>
              <p className="text-xs text-[#7F8DA3] mt-1">
                Lecture Theatre (33220B) • Jury Defense
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0F1C34] border border-[#1E293B] space-y-2 text-xs">
              <p className="text-[#7F8DA3] leading-relaxed">
                {round3.is_qualified
                  ? 'Congratulations! Your team has qualified for Round 3 in-person presentation. Report to the stage coordinator.'
                  : 'Notice: Final presentation problem statements and slide deck format will be officially announced by the organizers following Round 2.'}
              </p>
              {round3.entry && (
                <div className="pt-2 border-t border-[#1E293B] flex justify-between">
                  <span className="text-[#7F8DA3]">Jury Score:</span>
                  <span className="text-[#FFB800] font-bold font-mono">{round3.entry.round3_marks} / 50</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0F1C34] text-center text-xs text-[#7F8DA3]">
            {round3.is_qualified ? 'Status: Qualified Finalist' : 'Awaiting Round 2 Consolidation'}
          </div>
        </div>
      </div>

      {/* Anti-cheat guidelines */}
      <div className="p-6 rounded-2xl bg-[#0F1C34] border border-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-white">Academic Integrity Notice</h4>
            <p className="text-[#7F8DA3] leading-relaxed">
              All browser focus switches, tab changes, and window minimize events are logged in real-time. Reaching 3 strikes during Round 1 will automatically finalize and submit your test.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('/rules')}
          className="shrink-0 text-[#00C8FF] hover:underline font-semibold"
        >
          View Full Rules →
        </button>
      </div>
    </div>
  );
};

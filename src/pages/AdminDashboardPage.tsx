import React, { useEffect, useState } from 'react';
import { api } from '../services/api.ts';
import { useToast } from '../components/common/Toast.tsx';
import {
  Users,
  BrainCircuit,
  Bug,
  Presentation,
  ShieldAlert,
  Settings,
  Download,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Trophy,
  Sliders,
  Lock,
  Unlock,
  Terminal,
} from 'lucide-react';
import { AdminSettings, LeaderboardEntry, MCQQuestion, DebuggingProblem } from '../types.ts';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { success, error, warning } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'participants' | 'mcq' | 'debugging' | 'presentation' | 'results' | 'settings' | 'violations'
  >('overview');

  const [overview, setOverview] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [problems, setProblems] = useState<DebuggingProblem[]>([]);
  const [results, setResults] = useState<LeaderboardEntry[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [violations, setViolations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [participantSearch, setParticipantSearch] = useState('');

  // Jury scoring form
  const [selectedParticipantForJury, setSelectedParticipantForJury] = useState('');
  const [juryMarks, setJuryMarks] = useState<number>(40);
  const [juryComments, setJuryComments] = useState('');
  const [juryQualified, setJuryQualified] = useState(true);

  // New MCQ modal state
  const [editingQuestion, setEditingQuestion] = useState<Partial<MCQQuestion> | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [ov, parts, qs, probs, resData, sets, viols] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminParticipants(),
        api.getAdminQuestions(),
        api.getAdminProblems(),
        api.getAdminResults(),
        api.getAdminSettings(),
        api.getAdminViolations(),
      ]);

      setOverview(ov);
      setParticipants(parts);
      setQuestions(qs);
      setProblems(probs);
      setResults(resData.results);
      setSettings(sets);
      setViolations(viols);
    } catch (err: any) {
      error('Admin Data Load Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleToggleLock = async (pId: string, currentDisabled: boolean) => {
    try {
      await api.toggleParticipantLock(pId, !currentDisabled);
      success('Participant Updated', `Account status updated.`);
      loadAllData();
    } catch (err: any) {
      error('Failed to update account', err.message);
    }
  };

  const handleSaveSettings = async (updates: Partial<AdminSettings>) => {
    try {
      const updated = await api.updateAdminSettings(updates);
      setSettings(updated);
      success('Settings Updated', 'Competition parameters modified.');
      loadAllData();
    } catch (err: any) {
      error('Failed to update settings', err.message);
    }
  };

  const handleScorePresentation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipantForJury) {
      error('Selection required', 'Please select a participant / team.');
      return;
    }

    try {
      await api.scorePresentation({
        participant_id: selectedParticipantForJury,
        round3_marks: juryMarks,
        comments: juryComments,
        is_qualified: juryQualified,
      });
      success('Evaluation Recorded', 'Round 3 jury marks saved.');
      setJuryComments('');
      loadAllData();
    } catch (err: any) {
      error('Evaluation failed', err.message);
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    try {
      if (editingQuestion.id) {
        await api.updateAdminQuestion(editingQuestion.id, editingQuestion);
        success('Question Updated');
      } else {
        await api.createAdminQuestion(editingQuestion);
        success('Question Created');
      }
      setEditingQuestion(null);
      loadAllData();
    } catch (err: any) {
      error('Failed to save question', err.message);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!window.confirm('Delete this question permanently?')) return;
    try {
      await api.deleteAdminQuestion(id);
      success('Question Deleted');
      loadAllData();
    } catch (err: any) {
      error('Failed to delete', err.message);
    }
  };

  const handleExportCSV = () => {
    window.location.href = '/api/admin/export-csv';
  };

  if (loading && !overview) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#FFB800] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-[#7F8DA3]">Loading Vel Tech Admin Command Center...</p>
      </div>
    );
  }

  const filteredParticipants = participants.filter((p) => {
    const q = participantSearch.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.full_name.toLowerCase().includes(q) ||
      p.team_name.toLowerCase().includes(q) ||
      p.register_number.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="p-6 rounded-3xl bg-[#07111F] border border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40 text-xs font-bold font-mono">
              ADMIN CONTROL CENTER
            </span>
            <span className="text-xs text-[#7F8DA3]">Department of CSE (AI & ML)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Code Masters 2026 Operations
          </h1>
          <p className="text-xs text-[#7F8DA3]">
            Vel Tech University • Lecture Theatre (33220B)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            className="p-2.5 rounded-xl bg-[#0F1C34] text-[#7F8DA3] hover:text-white border border-[#1E293B]"
            title="Refresh All Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-black bg-[#FFB800] hover:brightness-110 shadow-[0_0_12px_rgba(255,184,0,0.3)]"
          >
            <Download className="w-3.5 h-3.5" />
            Export Leaderboard CSV
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1E293B]">
        {[
          { id: 'overview', label: 'Overview', icon: Users },
          { id: 'participants', label: 'Participants', icon: Users },
          { id: 'mcq', label: 'Round 1 (MCQ)', icon: BrainCircuit },
          { id: 'debugging', label: 'Round 2 (Problems)', icon: Bug },
          { id: 'presentation', label: 'Round 3 (Jury)', icon: Presentation },
          { id: 'results', label: 'Final Leaderboard', icon: Trophy },
          { id: 'settings', label: 'Round Controls', icon: Sliders },
          { id: 'violations', label: 'Proctoring Log', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#0878FF] text-white shadow-[0_0_10px_rgba(8,120,255,0.3)]'
                  : 'bg-[#07111F] text-[#7F8DA3] hover:text-white border border-[#1E293B]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-[#07111F] border border-[#1E293B]">
              <span className="text-xs text-[#7F8DA3] block">Registered</span>
              <p className="text-2xl font-bold font-mono text-white mt-1">{overview.total_registered}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#07111F] border border-[#1E293B]">
              <span className="text-xs text-[#7F8DA3] block">Active MCQ</span>
              <p className="text-2xl font-bold font-mono text-amber-400 mt-1">{overview.active_attempts}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#07111F] border border-[#1E293B]">
              <span className="text-xs text-[#7F8DA3] block">Round 1 Done</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{overview.round1_completed}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#07111F] border border-[#1E293B]">
              <span className="text-xs text-[#7F8DA3] block">R2 Submissions</span>
              <p className="text-2xl font-bold font-mono text-[#00C8FF] mt-1">{overview.round2_submissions}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#07111F] border border-[#1E293B]">
              <span className="text-xs text-[#7F8DA3] block">Violations</span>
              <p className="text-2xl font-bold font-mono text-rose-400 mt-1">{overview.total_violations}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#07111F] border border-[#1E293B]">
              <span className="text-xs text-[#7F8DA3] block">Finalists Scored</span>
              <p className="text-2xl font-bold font-mono text-[#FFB800] mt-1">{overview.round3_participants}</p>
            </div>
          </div>

          {/* Quick round toggles */}
          <div className="p-6 rounded-3xl bg-[#07111F] border border-[#1E293B] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#00C8FF]">
              Live Round Access Toggles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0F1C34] border border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Registrations</span>
                  <span className="text-[11px] text-[#7F8DA3]">
                    {settings?.registration_open ? 'Open' : 'Closed'}
                  </span>
                </div>
                <button
                  onClick={() => handleSaveSettings({ registration_open: !settings?.registration_open })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    settings?.registration_open ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {settings?.registration_open ? 'OPEN' : 'CLOSED'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1C34] border border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Round 1 (MCQ)</span>
                  <span className="text-[11px] text-[#7F8DA3]">
                    {settings?.round1_open ? 'Live' : 'Locked'}
                  </span>
                </div>
                <button
                  onClick={() => handleSaveSettings({ round1_open: !settings?.round1_open })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    settings?.round1_open ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {settings?.round1_open ? 'LIVE' : 'LOCKED'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1C34] border border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Round 2 (Debug)</span>
                  <span className="text-[11px] text-[#7F8DA3]">
                    {settings?.round2_open ? 'Live' : 'Locked'}
                  </span>
                </div>
                <button
                  onClick={() => handleSaveSettings({ round2_open: !settings?.round2_open })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    settings?.round2_open ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {settings?.round2_open ? 'LIVE' : 'LOCKED'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1C34] border border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Round 3 (Jury)</span>
                  <span className="text-[11px] text-[#7F8DA3]">
                    {settings?.round3_open ? 'Live' : 'Locked'}
                  </span>
                </div>
                <button
                  onClick={() => handleSaveSettings({ round3_open: !settings?.round3_open })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    settings?.round3_open ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {settings?.round3_open ? 'LIVE' : 'LOCKED'}
                </button>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="p-6 rounded-3xl bg-[#07111F] border border-[#1E293B] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#00C8FF]">
              System Audit Stream (Recent Actions)
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto font-mono text-xs">
              {overview.recent_activity?.map((log: any) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-[#0F1C34] border border-[#1E293B] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#00C8FF]">{log.user}</span>
                    <span className="text-[#7F8DA3]">[{log.action}]:</span>
                    <span className="text-white">{log.details}</span>
                  </div>
                  <span className="text-[#7F8DA3] text-[11px]">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PARTICIPANTS TAB */}
      {activeTab === 'participants' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#7F8DA3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={participantSearch}
                onChange={(e) => setParticipantSearch(e.target.value)}
                placeholder="Search by ID, name, team, or student reg no..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07111F] border border-[#1E293B] text-white text-xs placeholder-[#7F8DA3] focus:outline-none focus:border-[#0878FF]"
              />
            </div>
            <span className="text-xs text-[#7F8DA3]">
              Showing {filteredParticipants.length} of {participants.length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#1E293B] bg-[#07111F]">
            <table className="w-full text-left text-xs text-[#D9E2F0]">
              <thead className="bg-[#0F1C34] text-[#00C8FF] uppercase tracking-wider text-[11px] border-b border-[#1E293B]">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Candidate / Team</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Round 1 (MCQ)</th>
                  <th className="p-3.5">Round 2 (Debug)</th>
                  <th className="p-3.5">Violations</th>
                  <th className="p-3.5 text-right">Account State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/70">
                {filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-[#0F1C34]/40">
                    <td className="p-3.5 font-mono font-bold text-white">{p.id}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{p.full_name}</div>
                      <div className="text-[11px] text-[#7F8DA3]">{p.team_name} • {p.register_number}</div>
                    </td>
                    <td className="p-3.5">
                      <div>{p.department}</div>
                      <div className="text-[11px] text-[#7F8DA3]">{p.year}</div>
                    </td>
                    <td className="p-3.5">
                      {p.round1_attempt ? (
                        <div>
                          <span className="font-mono text-emerald-400 font-bold">
                            {p.round1_attempt.score}/25
                          </span>
                          <span className="text-[11px] text-[#7F8DA3] block">
                            {p.round1_attempt.status} ({p.round1_attempt.percentage}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#7F8DA3]">Not Started</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-white">
                        {p.debugging_submissions_count} submissions
                      </span>
                    </td>
                    <td className="p-3.5">
                      {p.violations_count > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-400">
                          {p.violations_count} Strikes
                        </span>
                      ) : (
                        <span className="text-emerald-400">Clean</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleToggleLock(p.id, p.is_disabled)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          p.is_disabled
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                            : 'bg-[#0F1C34] text-emerald-400 border border-emerald-500/40 hover:bg-[#1E293B]'
                        }`}
                      >
                        {p.is_disabled ? 'Locked' : 'Active'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ROUND 1 (MCQ QUESTIONS CRUD) */}
      {activeTab === 'mcq' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Round 1 Question Bank ({questions.length} Questions)
            </h2>
            <button
              onClick={() =>
                setEditingQuestion({
                  question: '',
                  option_a: '',
                  option_b: '',
                  option_c: '',
                  option_d: '',
                  correct_answer: 'A',
                  marks: 1,
                  difficulty: 'Medium',
                  category: 'Python Logic',
                  code_snippet: '',
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0878FF] hover:bg-[#0878FF]/90"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-[#07111F] border border-[#1E293B] space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[#00C8FF] font-bold">Question #{idx + 1} ({q.category})</span>
                    <h4 className="text-sm font-semibold text-white">{q.question}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingQuestion(q)}
                      className="p-1.5 text-[#00C8FF] hover:bg-[#0F1C34] rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {q.code_snippet && (
                  <pre className="p-3 rounded-xl bg-[#050B14] font-mono text-[11px] text-[#00C8FF]">
                    {q.code_snippet}
                  </pre>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className={`p-2 rounded-lg border ${q.correct_answer === 'A' ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300 font-bold' : 'bg-[#0F1C34] border-[#1E293B] text-[#D9E2F0]'}`}>
                    A: {q.option_a}
                  </div>
                  <div className={`p-2 rounded-lg border ${q.correct_answer === 'B' ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300 font-bold' : 'bg-[#0F1C34] border-[#1E293B] text-[#D9E2F0]'}`}>
                    B: {q.option_b}
                  </div>
                  <div className={`p-2 rounded-lg border ${q.correct_answer === 'C' ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300 font-bold' : 'bg-[#0F1C34] border-[#1E293B] text-[#D9E2F0]'}`}>
                    C: {q.option_c}
                  </div>
                  <div className={`p-2 rounded-lg border ${q.correct_answer === 'D' ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300 font-bold' : 'bg-[#0F1C34] border-[#1E293B] text-[#D9E2F0]'}`}>
                    D: {q.option_d}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit / Create Question Modal */}
          {editingQuestion && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <form
                onSubmit={handleSaveQuestion}
                className="max-w-2xl w-full p-6 sm:p-8 rounded-3xl bg-[#07111F] border border-[#1E293B] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs"
              >
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                  <h3 className="text-base font-bold text-white">
                    {editingQuestion.id ? 'Edit MCQ Question' : 'Create New MCQ Question'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingQuestion(null)}
                    className="text-[#7F8DA3] hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-[#D9E2F0] font-semibold mb-1">Question Prompt</label>
                  <textarea
                    value={editingQuestion.question || ''}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                    required
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#D9E2F0] font-semibold mb-1">Code Snippet (Optional)</label>
                  <textarea
                    value={editingQuestion.code_snippet || ''}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, code_snippet: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-[#00C8FF] font-mono text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#D9E2F0] font-semibold mb-1">Option A</label>
                    <input
                      type="text"
                      value={editingQuestion.option_a || ''}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, option_a: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#D9E2F0] font-semibold mb-1">Option B</label>
                    <input
                      type="text"
                      value={editingQuestion.option_b || ''}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, option_b: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#D9E2F0] font-semibold mb-1">Option C</label>
                    <input
                      type="text"
                      value={editingQuestion.option_c || ''}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, option_c: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#D9E2F0] font-semibold mb-1">Option D</label>
                    <input
                      type="text"
                      value={editingQuestion.option_d || ''}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, option_d: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#D9E2F0] font-semibold mb-1">Correct Answer</label>
                    <select
                      value={editingQuestion.correct_answer || 'A'}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, correct_answer: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white"
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#D9E2F0] font-semibold mb-1">Difficulty</label>
                    <select
                      value={editingQuestion.difficulty || 'Medium'}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#D9E2F0] font-semibold mb-1">Category</label>
                    <input
                      type="text"
                      value={editingQuestion.category || 'Python Core'}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1E293B] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingQuestion(null)}
                    className="px-4 py-2 rounded-xl bg-[#0F1C34] text-[#7F8DA3] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold text-white bg-[#0878FF]"
                  >
                    Save Question
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 4. ROUND 2 (DEBUGGING PROBLEMS) */}
      {activeTab === 'debugging' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white">
            Round 2 Debugging Problems ({problems.length} Problems)
          </h2>
          <div className="space-y-4">
            {problems.map((prob, idx) => (
              <div
                key={prob.id}
                className="p-6 rounded-3xl bg-[#07111F] border border-[#1E293B] space-y-4 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[#00C8FF] font-bold">Problem #{idx + 1}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{prob.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#0F1C34] text-[#00C8FF]">{prob.difficulty}</span>
                    <span className="px-2 py-0.5 rounded bg-[#0F1C34] text-white">{prob.marks} Marks</span>
                  </div>
                </div>

                <p className="text-[#7F8DA3] leading-relaxed">{prob.description}</p>

                <div className="rounded-xl overflow-hidden border border-[#1E293B]">
                  <div className="bg-[#0F1C34] px-3 py-1 font-mono text-[11px] text-[#7F8DA3]">Starter Code (Buggy):</div>
                  <pre className="p-3 bg-[#050B14] font-mono text-[11px] text-[#00C8FF] overflow-x-auto">
                    {prob.starter_code}
                  </pre>
                </div>

                <div className="text-[11px] text-[#7F8DA3]">
                  Visible Tests: {prob.visible_examples.length} • Hidden Test Cases: {prob.hidden_test_cases?.length || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ROUND 3 JURY EVALUATION */}
      {activeTab === 'presentation' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#07111F] border border-[#FFB800]/40 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FFB800]">
              Score Qualified Finalists (Round 3 Presentation)
            </h3>
            <p className="text-xs text-[#7F8DA3]">
              Faculty jury panel evaluation for shortlisted candidates defending algorithms in Lecture Theatre (33220B).
            </p>

            <form onSubmit={handleScorePresentation} className="space-y-4 pt-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-1">Select Candidate / Team</label>
                  <select
                    value={selectedParticipantForJury}
                    onChange={(e) => setSelectedParticipantForJury(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white"
                  >
                    <option value="">-- Choose Shortlisted Candidate --</option>
                    {participants.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} - {p.full_name} ({p.team_name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-1">Presentation Marks (Out of 50)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={juryMarks}
                    onChange={(e) => setJuryMarks(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-1">Jury Remarks & Defense Feedback</label>
                <textarea
                  value={juryComments}
                  onChange={(e) => setJuryComments(e.target.value)}
                  placeholder="e.g. Excellent algorithmic defense of time complexity, clear slide visuals."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={juryQualified}
                    onChange={(e) => setJuryQualified(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0878FF]"
                  />
                  <span>Mark as Officially Qualified for Finals Podium</span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-black bg-[#FFB800] hover:brightness-110 shadow-[0_0_15px_rgba(255,184,0,0.3)]"
                >
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. FINAL LEADERBOARD & RESULTS */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Consolidated Event Leaderboard</h2>
              <p className="text-xs text-[#7F8DA3]">
                Weighted Formula: Round 1 (30%) + Round 2 (40%) + Round 3 (30%)
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-black bg-[#FFB800]"
            >
              <Download className="w-3.5 h-3.5" />
              Download Official CSV
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#1E293B] bg-[#07111F]">
            <table className="w-full text-left text-xs text-[#D9E2F0]">
              <thead className="bg-[#0F1C34] text-[#00C8FF] uppercase tracking-wider text-[11px] border-b border-[#1E293B]">
                <tr>
                  <th className="p-3.5">Rank</th>
                  <th className="p-3.5">Participant</th>
                  <th className="p-3.5">R1 (MCQ)</th>
                  <th className="p-3.5">R2 (Debug)</th>
                  <th className="p-3.5">R3 (Jury)</th>
                  <th className="p-3.5 font-bold text-white">Total Score</th>
                  <th className="p-3.5">Time Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/70 font-mono">
                {results.map((entry) => {
                  let podiumBadge = null;
                  if (entry.rank === 1) podiumBadge = <span className="text-[#FFB800] font-black">1st (Winner)</span>;
                  else if (entry.rank === 2) podiumBadge = <span className="text-[#00C8FF] font-black">2nd</span>;
                  else if (entry.rank === 3) podiumBadge = <span className="text-[#0878FF] font-black">3rd</span>;
                  else if (entry.rank === 4) podiumBadge = <span className="text-white font-bold">4th</span>;

                  return (
                    <tr key={entry.participant_id} className="hover:bg-[#0F1C34]/40 font-mono text-xs">
                      <td className="p-3.5">
                        {podiumBadge || `#${entry.rank}`}
                      </td>
                      <td className="p-3.5 font-sans">
                        <div className="font-bold text-white">{entry.full_name}</div>
                        <div className="text-[11px] text-[#7F8DA3]">{entry.team_name} • {entry.participant_id}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="text-white">{entry.round1.raw_score}</span>
                        <span className="text-[#7F8DA3] text-[10px] block">w: {entry.round1.weighted_score}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-white">{entry.round2.raw_score}</span>
                        <span className="text-[#7F8DA3] text-[10px] block">w: {entry.round2.weighted_score}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-white">{entry.round3.raw_score}</span>
                        <span className="text-[#7F8DA3] text-[10px] block">w: {entry.round3.weighted_score}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-lg font-extrabold text-[#00C8FF]">{entry.total_score}</span>
                      </td>
                      <td className="p-3.5 text-[#7F8DA3]">
                        {entry.round1.time_seconds}s
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. ROUND CONTROLS & SETTINGS */}
      {activeTab === 'settings' && settings && (
        <div className="p-6 rounded-3xl bg-[#07111F] border border-[#1E293B] space-y-6 max-w-3xl">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-[#00C8FF]">
            Platform Parameters & Scoring Weights
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-white font-semibold mb-1">R1 Weight (MCQ)</label>
              <input
                type="number"
                step="0.05"
                value={settings.r1_weight}
                onChange={(e) => handleSaveSettings({ r1_weight: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-1">R2 Weight (Debugging)</label>
              <input
                type="number"
                step="0.05"
                value={settings.r2_weight}
                onChange={(e) => handleSaveSettings({ r2_weight: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-1">R3 Weight (Jury)</label>
              <input
                type="number"
                step="0.05"
                value={settings.r3_weight}
                onChange={(e) => handleSaveSettings({ r3_weight: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-[#1E293B]">
            <div>
              <label className="block text-white font-semibold mb-1">R1 Duration (Minutes)</label>
              <input
                type="number"
                value={settings.round1_duration_mins}
                onChange={(e) => handleSaveSettings({ round1_duration_mins: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-1">Max Proctoring Violations (Strikes)</label>
              <input
                type="number"
                value={settings.max_violations}
                onChange={(e) => handleSaveSettings({ max_violations: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E293B]">
            <label className="block text-white font-semibold mb-1 text-xs">Primary Tie Breaker Criterion</label>
            <select
              value={settings.tie_breaker}
              onChange={(e) => handleSaveSettings({ tie_breaker: e.target.value as any })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white text-xs"
            >
              <option value="debugging">Higher Round 2 Debugging Score</option>
              <option value="mcq">Higher Round 1 MCQ Score</option>
              <option value="time">Fastest Submission Time</option>
            </select>
          </div>
        </div>
      )}

      {/* 8. PROCTORING & VIOLATIONS LOG */}
      {activeTab === 'violations' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white">
            Anti-Tab Switch Violation Records ({violations.length} logged)
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[#1E293B] bg-[#07111F]">
            <table className="w-full text-left text-xs text-[#D9E2F0]">
              <thead className="bg-[#0F1C34] text-rose-400 uppercase tracking-wider text-[11px] border-b border-[#1E293B]">
                <tr>
                  <th className="p-3.5">Time</th>
                  <th className="p-3.5">Participant ID</th>
                  <th className="p-3.5">Round</th>
                  <th className="p-3.5">Violation Trigger</th>
                  <th className="p-3.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/70 font-mono">
                {violations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-[#7F8DA3]">
                      No anti-cheat violations recorded.
                    </td>
                  </tr>
                ) : (
                  violations.map((v) => (
                    <tr key={v.id} className="hover:bg-rose-950/20">
                      <td className="p-3.5 text-[#7F8DA3]">
                        {new Date(v.created_at).toLocaleTimeString()}
                      </td>
                      <td className="p-3.5 font-bold text-white">{v.participant_id}</td>
                      <td className="p-3.5 text-[#00C8FF]">{v.round}</td>
                      <td className="p-3.5 text-rose-400 font-bold">{v.violation_type}</td>
                      <td className="p-3.5 text-[#D9E2F0] font-sans">{v.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

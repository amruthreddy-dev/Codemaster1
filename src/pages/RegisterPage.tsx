import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../components/common/Toast.tsx';
import { CodeMastersLogo } from '../components/common/CodeMastersLogo.tsx';
import { TeamMember } from '../types.ts';
import {
  User,
  Mail,
  Phone,
  Hash,
  GraduationCap,
  Calendar,
  Users,
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const { success, error } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [department, setDepartment] = useState('CSE (AI & ML)');
  const [year, setYear] = useState('3rd Year');
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [loading, setLoading] = useState(false);
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAddMember = () => {
    if (teamMembers.length >= 2) {
      error('Team limit reached', 'Teams can have a maximum of 3 members (Leader + 2 Members).');
      return;
    }
    setTeamMembers([...teamMembers, { name: '', register_number: '' }]);
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !registerNumber || !department || !year || !teamName || !password) {
      error('Missing required fields', 'Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      error('Password too short', 'Password must be at least 6 characters long.');
      return;
    }

    // Validate team members
    for (const m of teamMembers) {
      if (!m.name.trim() || !m.register_number.trim()) {
        error('Incomplete team member', 'Please specify both Name and Register Number for each additional member.');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await register({
        full_name: fullName,
        email,
        phone,
        register_number: registerNumber,
        department,
        year,
        team_name: teamName,
        password,
        team_members: teamMembers,
      });

      setRegisteredId(res.participant_id);
      success('Registration Successful!', `Your Participant ID is ${res.participant_id}`);
    } catch (err: any) {
      error('Registration Failed', err.message || 'Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (registeredId) {
      navigator.clipboard.writeText(registeredId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // SUCCESS SCREEN
  if (registeredId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Registration Confirmed!
          </h2>
          <p className="text-sm text-[#D9E2F0]/80">
            Welcome to Code Masters 2026, Department of CSE (AI & ML), Vel Tech University.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#07111F] border border-[#0878FF]/50 space-y-4 text-left shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <span className="text-xs font-semibold text-[#7F8DA3] uppercase tracking-wider">
              Official Participant ID
            </span>
            <span className="text-xs text-emerald-400 font-mono">STATUS: CONFIRMED</span>
          </div>

          <div className="flex items-center justify-between bg-[#0F1C34] p-4 rounded-xl border border-[#1E293B]">
            <span className="font-mono text-2xl font-black text-[#00C8FF] tracking-wider">
              {registeredId}
            </span>
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0878FF]/20 text-[#00C8FF] hover:bg-[#0878FF]/30 border border-[#0878FF]/40 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Copied!' : 'Copy ID'}
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-[#7F8DA3]">
            <p><strong className="text-white">Team Name:</strong> {teamName}</p>
            <p><strong className="text-white">Leader:</strong> {fullName} ({registerNumber})</p>
            <p><strong className="text-white">Date & Venue:</strong> 29 Sep 2026, 9:00 AM • LT (33220B)</p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0878FF] to-[#00C8FF] shadow-[0_0_20px_rgba(8,120,255,0.4)] flex items-center justify-center gap-2"
          >
            Enter Participant Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-[#7F8DA3] hover:text-white bg-[#07111F] border border-[#1E293B]"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // REGISTRATION FORM
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto flex flex-col items-center">
        <CodeMastersLogo variant="compact" className="mb-3" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0878FF]/10 border border-[#0878FF]/30 text-[#00C8FF] text-xs font-semibold tracking-wider uppercase mb-3">
          CANDIDATE ENROLLMENT
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Participant Registration
        </h1>
        <p className="text-xs sm:text-sm text-[#D9E2F0]/80 mt-2">
          Code Masters 2026 • Department of CSE (AI & ML), School of Computing, Vel Tech University
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-10 rounded-3xl bg-[#07111F] border border-[#1E293B] shadow-2xl space-y-8"
      >
        {/* Section 1: Team Details */}
        <div className="space-y-4">
          <div className="border-b border-[#1E293B] pb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00C8FF]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Team Information
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D9E2F0] mb-1.5">
              Team Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. ByteBrigade, NeuralKnights, AlphaAlgo"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white text-sm placeholder-[#7F8DA3] focus:outline-none focus:border-[#0878FF]"
            />
          </div>
        </div>

        {/* Section 2: Team Leader Details */}
        <div className="space-y-4">
          <div className="border-b border-[#1E293B] pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[#00C8FF]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Team Leader / Primary Candidate Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#D9E2F0] mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Student full name"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white text-sm placeholder-[#7F8DA3] focus:outline-none focus:border-[#0878FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D9E2F0] mb-1.5">
                Register Number / Student ID <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                placeholder="e.g. VTU21045"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white text-sm placeholder-[#7F8DA3] focus:outline-none focus:border-[#0878FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D9E2F0] mb-1.5">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@veltech.edu.in"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white text-sm placeholder-[#7F8DA3] focus:outline-none focus:border-[#0878FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D9E2F0] mb-1.5">
                Phone / WhatsApp Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white text-sm placeholder-[#7F8DA3] focus:outline-none focus:border-[#0878FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D9E2F0] mb-1.5">
                Department <span className="text-rose-400">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#0878FF]"
              >
                <option value="CSE (AI & ML)">CSE (AI & ML)</option>
                <option value="CSE (General)">CSE (General)</option>
                <option value="CSE (Data Science)">CSE (Data Science)</option>
                <option value="Information Technology">Information Technology</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Other Department">Other Department</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D9E2F0] mb-1.5">
                Year of Study <span className="text-rose-400">*</span>
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-[#0878FF]"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Additional Team Members (Optional) */}
        <div className="space-y-4">
          <div className="border-b border-[#1E293B] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00C8FF]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Additional Team Members (Optional, Max 2)
              </h3>
            </div>
            {teamMembers.length < 2 && (
              <button
                type="button"
                onClick={handleAddMember}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#0878FF]/20 text-[#00C8FF] hover:bg-[#0878FF]/30 border border-[#0878FF]/40 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Member
              </button>
            )}
          </div>

          {teamMembers.length === 0 ? (
            <p className="text-xs text-[#7F8DA3] italic">
              Competing solo? No additional members needed. If participating as a team, click "+ Add Member" above.
            </p>
          ) : (
            <div className="space-y-3">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#0F1C34] border border-[#1E293B] flex flex-col sm:flex-row items-center gap-3"
                >
                  <span className="text-xs font-mono font-bold text-[#00C8FF] shrink-0">
                    Member #{idx + 2}:
                  </span>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#1E293B] text-white text-xs placeholder-[#7F8DA3] focus:outline-none focus:border-[#0878FF]"
                  />
                  <input
                    type="text"
                    value={member.register_number}
                    onChange={(e) => handleMemberChange(idx, 'register_number', e.target.value)}
                    placeholder="Register Number"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#07111F] border border-[#1E293B] text-white text-xs placeholder-[#7F8DA3] focus:outline-none focus:border-[#0878FF]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(idx)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Security / Password */}
        <div className="space-y-4">
          <div className="border-b border-[#1E293B] pb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#00C8FF]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Account Security
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D9E2F0] mb-1.5">
              Portal Password <span className="text-rose-400">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters (used to log into exam arena)"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white text-sm placeholder-[#7F8DA3] focus:outline-none focus:border-[#0878FF]"
            />
            <p className="text-[11px] text-[#7F8DA3] mt-1.5">
              Keep this password secure. You will need it together with your Participant ID to enter Round 1 and Round 2 on 29 September 2026.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#7F8DA3]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official University Record Storage</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0878FF] to-[#00C8FF] hover:brightness-110 shadow-[0_0_20px_rgba(8,120,255,0.4)] transition-all disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </div>
      </form>

      {/* Already registered prompt */}
      <div className="text-center text-xs text-[#7F8DA3]">
        Already registered?{' '}
        <button
          onClick={() => onNavigate('/login')}
          className="text-[#00C8FF] font-semibold hover:underline"
        >
          Sign into Participant Portal
        </button>
      </div>
    </div>
  );
};

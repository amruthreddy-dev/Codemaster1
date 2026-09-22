import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../components/common/Toast.tsx';
import { CodeMastersLogo } from '../components/common/CodeMastersLogo.tsx';
import { LogIn, User, Lock, ShieldCheck, KeyRound, ArrowRight, ShieldAlert } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const { success, error } = useToast();

  const [mode, setMode] = useState<'PARTICIPANT' | 'ADMIN'>('PARTICIPANT');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      error('Incomplete credentials', 'Please enter both your identifier and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(identifier, password);
      success('Welcome back!', `Logged in successfully as ${res.role}.`);
      if (res.role === 'ADMIN') {
        onNavigate('/admin');
      } else {
        onNavigate('/dashboard');
      }
    } catch (err: any) {
      error('Login Failed', err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setMode('ADMIN');
    setIdentifier('admin');
    setPassword('admin123');
  };

  const handleFillDemoParticipant = () => {
    setMode('PARTICIPANT');
    setIdentifier('CM26-1001');
    setPassword('password123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <CodeMastersLogo variant="compact" className="justify-center" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Code Masters Portal
        </h1>
        <p className="text-xs text-[#7F8DA3]">
          Department of CSE (AI & ML), Vel Tech University
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="p-1 rounded-2xl bg-[#07111F] border border-[#1E293B] flex">
        <button
          type="button"
          onClick={() => {
            setMode('PARTICIPANT');
            setIdentifier('');
            setPassword('');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'PARTICIPANT'
              ? 'bg-[#0878FF] text-white shadow-[0_0_12px_rgba(8,120,255,0.3)]'
              : 'text-[#7F8DA3] hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Participant Login
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('ADMIN');
            setIdentifier('');
            setPassword('');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'ADMIN'
              ? 'bg-[#FFB800] text-black shadow-[0_0_12px_rgba(255,184,0,0.3)]'
              : 'text-[#7F8DA3] hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Admin Console
        </button>
      </div>

      {/* Login Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#07111F] border border-[#1E293B] shadow-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#D9E2F0] mb-1.5">
              {mode === 'ADMIN' ? 'Admin Username' : 'Participant ID or Registered Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#7F8DA3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={mode === 'ADMIN' ? 'admin' : 'e.g. CM26-1001 or email@veltech.edu.in'}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white text-sm placeholder-[#7F8DA3] focus:outline-none focus:border-[#0878FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D9E2F0] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7F8DA3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-white text-sm placeholder-[#7F8DA3] focus:outline-none focus:border-[#0878FF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'ADMIN'
                ? 'bg-[#FFB800] text-black hover:brightness-110 shadow-[0_0_15px_rgba(255,184,0,0.3)]'
                : 'bg-gradient-to-r from-[#0878FF] to-[#00C8FF] text-white hover:brightness-110 shadow-[0_0_20px_rgba(8,120,255,0.4)]'
            }`}
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : mode === 'ADMIN' ? 'Sign In as Administrator' : 'Enter Competition Arena'}
          </button>
        </form>

        {/* Quick Demo Fill Buttons for Examiners & Evaluators */}
        <div className="pt-4 border-t border-[#1E293B] space-y-2">
          <p className="text-[11px] text-[#7F8DA3] uppercase tracking-wider font-semibold text-center">
            Demo Credentials (Quick Testing)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleFillDemoParticipant}
              className="flex-1 py-2 px-2 rounded-lg bg-[#0F1C34] hover:bg-[#1E293B] border border-[#1E293B] text-[11px] text-[#00C8FF] transition-all font-mono"
            >
              Fill Sample Participant
            </button>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="flex-1 py-2 px-2 rounded-lg bg-[#0F1C34] hover:bg-[#1E293B] border border-[#1E293B] text-[11px] text-[#FFB800] transition-all font-mono"
            >
              Fill Admin (admin)
            </button>
          </div>
        </div>
      </div>

      {/* Registration link */}
      <div className="text-center text-xs text-[#7F8DA3]">
        Don't have a Participant ID yet?{' '}
        <button
          onClick={() => onNavigate('/register')}
          className="text-[#00C8FF] font-semibold hover:underline"
        >
          Register for Code Masters 2026
        </button>
      </div>
    </div>
  );
};

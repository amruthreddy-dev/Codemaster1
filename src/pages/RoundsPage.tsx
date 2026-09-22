import React from 'react';
import { BrainCircuit, Bug, Presentation, Clock, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

interface RoundsPageProps {
  onNavigate: (path: string) => void;
}

export const RoundsPage: React.FC<RoundsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0878FF]/10 border border-[#0878FF]/30 text-[#00C8FF] text-xs font-semibold tracking-wider uppercase mb-3">
          COMPETITION STRUCTURE
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Three Rounds. One Championship.
        </h1>
        <p className="text-[#D9E2F0]/80 mt-4 leading-relaxed">
          Code Masters is divided into three progressive elimination rounds designed to test theoretical depth, real-time code diagnosis, and oral algorithmic defense.
        </p>
      </div>

      {/* Summary Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-[#D9E2F0] border border-[#1E293B] rounded-2xl overflow-hidden bg-[#07111F]">
          <thead className="bg-[#0F1C34] text-[#00C8FF] uppercase tracking-wider text-xs border-b border-[#1E293B]">
            <tr>
              <th className="p-4">Round</th>
              <th className="p-4">Nature & Tool</th>
              <th className="p-4">Count / Scope</th>
              <th className="p-4">Time Allocated</th>
              <th className="p-4">Weightage</th>
              <th className="p-4">Evaluation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/70">
            <tr>
              <td className="p-4 font-bold text-white">Round 01: MCQ</td>
              <td className="p-4 text-[#7F8DA3]">Distraction-Free Web Portal</td>
              <td className="p-4 font-semibold text-white">25 Python Questions</td>
              <td className="p-4 text-[#00C8FF] font-mono font-bold">30 Minutes</td>
              <td className="p-4">30% Total Score</td>
              <td className="p-4 text-emerald-400">Automated Instant Grading</td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-white">Round 02: Debugging</td>
              <td className="p-4 text-[#7F8DA3]">Monaco Editor & Python Sandbox</td>
              <td className="p-4 font-semibold text-white">5 Broken Programs</td>
              <td className="p-4 text-[#00C8FF] font-mono font-bold">45 Minutes</td>
              <td className="p-4">40% Total Score</td>
              <td className="p-4 text-emerald-400">Automated Hidden Test Suites</td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-white">Round 03: Presentation</td>
              <td className="p-4 text-[#7F8DA3]">In-Person Lecture Theatre (33220B)</td>
              <td className="p-4 font-semibold text-white">Top Shortlisted Teams</td>
              <td className="p-4 text-[#FFB800] font-mono font-bold">10 Mins / Team</td>
              <td className="p-4">30% Total Score</td>
              <td className="p-4 text-[#FFB800]">Faculty Jury Panel</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Round 1 Detailed Card */}
      <div className="p-8 rounded-3xl bg-[#07111F] border border-[#1E293B] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B]/70 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0F1C34] border border-[#0878FF]/50 text-[#00C8FF] flex items-center justify-center">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#00C8FF]">Round 01</span>
              <h2 className="text-2xl font-extrabold text-white">MCQ Challenge (25 Questions)</h2>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0878FF]/15 border border-[#0878FF]/30 text-[#00C8FF] text-xs font-mono font-bold">
            <Clock className="w-4 h-4" />
            30 MINUTES RUNTIME
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#D9E2F0]">
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Key Domains Covered</h4>
            <ul className="space-y-2.5 text-[#7F8DA3]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                <span><strong className="text-white">Output Prediction:</strong> Complex nested loops, slicing operations, and mutable default function arguments.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                <span><strong className="text-white">Python Internals:</strong> Memory references, `is` vs `==`, integer interning, global vs nonlocal namespaces.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                <span><strong className="text-white">Data Structures:</strong> Dictionaries, hashing collusions, set operations, list comprehensions, and tuples.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                <span><strong className="text-white">OOP & Generators:</strong> Class inheritance, `__repr__`, dunder methods, `yield`, and iterator behavior.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Anti-Cheat & Exam Rules</h4>
            <div className="p-4 rounded-xl bg-[#0F1C34] border border-[#1E293B] space-y-3">
              <div className="flex items-start gap-2 text-rose-400">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-semibold">Automated Tab-Switch Violation Detection</span>
              </div>
              <p className="text-[#7F8DA3] leading-relaxed">
                The portal monitors active browser focus. Switching tabs, opening secondary windows, or minimizing the window will trigger automated warnings:
              </p>
              <div className="space-y-1 font-mono text-[11px] text-[#D9E2F0]">
                <p>• Strike 1: System logged & on-screen warning alert</p>
                <p>• Strike 2: Severe warning with red border lock</p>
                <p className="text-rose-400 font-bold">• Strike 3: Automatic instant test submission!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Round 2 Detailed Card */}
      <div className="p-8 rounded-3xl bg-[#07111F] border border-[#1E293B] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B]/70 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0F1C34] border border-[#0878FF]/50 text-[#00C8FF] flex items-center justify-center">
              <Bug className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#00C8FF]">Round 02</span>
              <h2 className="text-2xl font-extrabold text-white">Python Debugging Arena (5 Programs)</h2>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0878FF]/15 border border-[#0878FF]/30 text-[#00C8FF] text-xs font-mono font-bold">
            <Clock className="w-4 h-4" />
            45 MINUTES RUNTIME
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#D9E2F0]">
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Arena Architecture</h4>
            <ul className="space-y-2.5 text-[#7F8DA3]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                <span><strong className="text-white">Full Monaco Code Editor:</strong> High-performance browser IDE with syntax highlighting, line numbers, and indentation helpers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                <span><strong className="text-white">Run vs Submit Flow:</strong> Use "Run Code" to test against visible examples. Click "Submit Solution" to trigger hidden automated grading.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                <span><strong className="text-white">Sandbox Isolation:</strong> Executes in an isolated Python 3 subprocess with strict 3-second timeout protection against infinite loops.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Included Problem Set</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] flex items-center justify-between">
                <span className="font-semibold text-white">Problem 1: Palindrome Substring Flaw</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">Easy • 20 Pts</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] flex items-center justify-between">
                <span className="font-semibold text-white">Problem 2: Anagram Frequency Mismatch</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">Easy • 20 Pts</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] flex items-center justify-between">
                <span className="font-semibold text-white">Problem 3: Binary Search Range Bound Bug</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">Medium • 20 Pts</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] flex items-center justify-between">
                <span className="font-semibold text-white">Problem 4: Subarray Sum Zero Hash Flaw</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">Medium • 20 Pts</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0F1C34] border border-[#1E293B] flex items-center justify-between">
                <span className="font-semibold text-white">Problem 5: Valid Parentheses Stack Underflow</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400">Hard • 20 Pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Round 3 Detailed Card */}
      <div className="p-8 rounded-3xl bg-[#07111F] border border-[#FFB800]/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B]/70 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0F1C34] border border-[#FFB800]/50 text-[#FFB800] flex items-center justify-center">
              <Presentation className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFB800]">Round 03</span>
              <h2 className="text-2xl font-extrabold text-white">Final Presentation & Defense</h2>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFB800]/15 border border-[#FFB800]/30 text-[#FFB800] text-xs font-mono font-bold">
            FINALS JURY
          </div>
        </div>

        <div className="space-y-4 text-xs text-[#D9E2F0]">
          <div className="p-4 rounded-xl bg-[#0F1C34] border border-[#FFB800]/30 text-[#FFB800] font-medium leading-relaxed">
            Important Notice: The exact final presentation problem statements and slide deck format will be officially announced by the faculty organizers to the qualified shortlisted teams following Round 2.
          </div>
          <p className="text-[#7F8DA3] leading-relaxed">
            Shortlisted participants will step onto the stage in Lecture Theatre (33220B). Each team will be given 10 minutes to walk through their architectural decisions, algorithmic time and space complexity evaluations, and answer challenging defense questions posed by faculty examiners.
          </p>
        </div>
      </div>

      {/* Register banner */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('/register')}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0878FF] to-[#00C8FF] shadow-[0_0_20px_rgba(8,120,255,0.4)]"
        >
          Register for All Three Rounds
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

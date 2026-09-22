import React from 'react';
import { RuleSection } from '../types.ts';
import { ShieldAlert, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface RulesPageProps {
  rules: RuleSection[];
  onNavigate: (path: string) => void;
}

export const RulesPage: React.FC<RulesPageProps> = ({ rules, onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0878FF]/10 border border-[#0878FF]/30 text-[#00C8FF] text-xs font-semibold tracking-wider uppercase mb-3">
          CODE OF CONDUCT & POLICIES
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Competition Rules
        </h1>
        <p className="text-sm text-[#D9E2F0]/80 mt-3">
          Please review the official regulations governing eligibility, workstation integrity, and round evaluations.
        </p>
      </div>

      {/* Critical Highlight Alert: Anti-Tab Switch Violation */}
      <div className="p-6 rounded-2xl bg-[#0F1C34] border-2 border-rose-500/50 shadow-xl space-y-3">
        <div className="flex items-center gap-3 text-rose-400">
          <ShieldAlert className="w-6 h-6 shrink-0" />
          <h3 className="text-base font-bold text-white">
            Strict Academic Integrity & Anti-Tab Switch Policy
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#D9E2F0] leading-relaxed">
          During Round 1 (MCQ Challenge), the platform employs active window state monitoring. Opening secondary tabs, minimizing the browser window, or navigating to external resources will automatically record a violation strike:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#07111F] border border-[#1E293B]">
            <span className="text-[#FFB800] font-bold">Strike 1:</span>
            <p className="text-[#7F8DA3] mt-1">Logged to audit record with on-screen notification.</p>
          </div>
          <div className="p-3 rounded-xl bg-[#07111F] border border-[#1E293B]">
            <span className="text-amber-400 font-bold">Strike 2:</span>
            <p className="text-[#7F8DA3] mt-1">Final warning alert and lock banner.</p>
          </div>
          <div className="p-3 rounded-xl bg-[#07111F] border border-rose-500/40">
            <span className="text-rose-400 font-bold">Strike 3:</span>
            <p className="text-rose-300 mt-1">Immediate automated test submission!</p>
          </div>
        </div>
      </div>

      {/* Structured Rules Sections */}
      <div className="space-y-6">
        {rules.map((section) => (
          <div
            key={section.id}
            className="p-6 sm:p-8 rounded-2xl bg-[#07111F] border border-[#1E293B] space-y-4"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#00C8FF]" />
              <h2 className="text-lg font-bold text-white">{section.title}</h2>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#D9E2F0]/80">
              {section.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer advice */}
      <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1E293B] text-center space-y-3">
        <p className="text-xs text-[#7F8DA3]">
          Questions regarding rule interpretations should be directed to the faculty coordinators prior to Round 1 commencement.
        </p>
        <button
          onClick={() => onNavigate('/faq')}
          className="text-xs font-semibold text-[#00C8FF] hover:underline"
        >
          Frequently Asked Questions →
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Trophy, Award, Medal, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface PrizesPageProps {
  onNavigate: (path: string) => void;
}

export const PrizesPage: React.FC<PrizesPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] text-xs font-semibold tracking-wider uppercase mb-3">
          OFFICIAL AWARDS & HONORS
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          ₹5,250 Prize Pool
        </h1>
        <p className="text-base text-[#D9E2F0]/80 mt-3">
          Rewarding algorithmic excellence, diagnostic precision, and outstanding problem-solving capability.
        </p>
      </div>

      {/* Prize Podium Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1st Place */}
        <div className="p-8 rounded-3xl bg-[#0F1C34] border-2 border-[#FFB800] text-center relative shadow-[0_0_35px_rgba(255,184,0,0.2)] transform hover:-translate-y-1 transition-all flex flex-col justify-between">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FFB800] text-black text-[10px] font-black uppercase tracking-wider">
            FIRST PLACE CHAMPION
          </div>
          <div>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FFB800]/20 text-[#FFB800] flex items-center justify-center font-extrabold text-2xl mb-4 border border-[#FFB800]/40">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white">1st Place</h3>
            <p className="text-4xl font-extrabold text-[#FFB800] my-3">₹2,000</p>
            <p className="text-xs text-[#00C8FF] font-semibold mb-6">Winner Trophy + Cash Award</p>
            <ul className="text-left space-y-2 text-xs text-[#D9E2F0]/90 border-t border-[#1E293B] pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FFB800]" />
                <span>Official Code Masters Grand Trophy</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FFB800]" />
                <span>Cash Prize of ₹2,000</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FFB800]" />
                <span>Certificate of Technical Excellence</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 2nd Place */}
        <div className="p-8 rounded-3xl bg-[#07111F] border border-[#00C8FF]/50 text-center relative transform hover:-translate-y-1 transition-all flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00C8FF]/20 text-[#00C8FF] flex items-center justify-center font-extrabold text-2xl mb-4 border border-[#00C8FF]/40">
              <Medal className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white">2nd Place</h3>
            <p className="text-4xl font-extrabold text-[#00C8FF] my-3">₹1,500</p>
            <p className="text-xs text-[#7F8DA3] font-semibold mb-6">Runner-up Award + Cash</p>
            <ul className="text-left space-y-2 text-xs text-[#D9E2F0]/90 border-t border-[#1E293B] pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C8FF]" />
                <span>Runner-up Memento Award</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C8FF]" />
                <span>Cash Prize of ₹1,500</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C8FF]" />
                <span>Certificate of High Merit</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="p-8 rounded-3xl bg-[#07111F] border border-[#0878FF]/50 text-center relative transform hover:-translate-y-1 transition-all flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0878FF]/20 text-[#0878FF] flex items-center justify-center font-extrabold text-2xl mb-4 border border-[#0878FF]/40">
              <Medal className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white">3rd Place</h3>
            <p className="text-4xl font-extrabold text-[#0878FF] my-3">₹1,000</p>
            <p className="text-xs text-[#7F8DA3] font-semibold mb-6">Second Runner-up</p>
            <ul className="text-left space-y-2 text-xs text-[#D9E2F0]/90 border-t border-[#1E293B] pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0878FF]" />
                <span>Second Runner-up Honor</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0878FF]" />
                <span>Cash Prize of ₹1,000</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0878FF]" />
                <span>Certificate of High Merit</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4th Place */}
        <div className="p-8 rounded-3xl bg-[#07111F] border border-[#1E293B] text-center relative transform hover:-translate-y-1 transition-all flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#7F8DA3]/20 text-[#D9E2F0] flex items-center justify-center font-extrabold text-2xl mb-4 border border-[#1E293B]">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white">4th Place</h3>
            <p className="text-4xl font-extrabold text-white my-3">₹750</p>
            <p className="text-xs text-[#7F8DA3] font-semibold mb-6">Consolation Prize</p>
            <ul className="text-left space-y-2 text-xs text-[#D9E2F0]/90 border-t border-[#1E293B] pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7F8DA3]" />
                <span>Consolation Honor</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7F8DA3]" />
                <span>Cash Prize of ₹750</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7F8DA3]" />
                <span>Certificate of Special Merit</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Participation Certificates Note */}
      <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0878FF]/20 text-[#00C8FF] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Certificate of Participation</h4>
            <p className="text-xs text-[#7F8DA3] mt-1">
              Every participant who officially reports and completes Round 1 will receive a verified Certificate of Participation issued by the Department of CSE (AI & ML), Vel Tech University.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('/register')}
          className="shrink-0 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0878FF] to-[#00C8FF]"
        >
          Register for the Event
        </button>
      </div>
    </div>
  );
};

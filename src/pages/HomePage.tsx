import React from 'react';
import { CodeMastersLogo } from '../components/common/CodeMastersLogo.tsx';
import { EventInfo } from '../types.ts';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  Terminal,
  BrainCircuit,
  Bug,
  Presentation,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Code2,
  Sparkles,
} from 'lucide-react';

interface HomePageProps {
  eventInfo: EventInfo | null;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ eventInfo, onNavigate }) => {
  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Subtle background tech matrix grid & light radial glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#0878FF_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#0878FF]/15 blur-[120px] rounded-full pointer-events-none" />

        {/* Subtle decorative code floating elements */}
        <div className="hidden lg:block absolute left-8 top-28 font-mono text-xs text-[#00C8FF]/20 select-none pointer-events-none leading-relaxed">
          <p>{`def evaluate_candidate(skills):`}</p>
          <p className="pl-4">{`logic = skills.test_mcq(count=25)`}</p>
          <p className="pl-4">{`arena = skills.debug_python(problems=5)`}</p>
          <p className="pl-4">{`return logic and arena`}</p>
        </div>
        <div className="hidden lg:block absolute right-8 top-32 font-mono text-xs text-[#FFB800]/20 select-none pointer-events-none text-right leading-relaxed">
          <p>{`{ "event": "CODE_MASTERS_2026",`}</p>
          <p>{`  "dept": "CSE_AIML",`}</p>
          <p>{`  "venue": "LT_33220B",`}</p>
          <p>{`  "prizes": 5250 }`}</p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Eyebrow / Host */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0F1C34] border border-[#0878FF]/40 text-[#00C8FF] text-xs sm:text-sm font-semibold tracking-wider mb-6 shadow-[0_0_20px_rgba(8,120,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#00C8FF] animate-ping" />
            CSE – AIML INVITES YOU
          </div>

          {/* Prominent Official Code Masters Logo */}
          <div className="mb-4">
            <CodeMastersLogo variant="hero" />
          </div>

          {/* Event Meta Highlight */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm text-[#D9E2F0] font-medium my-6">
            <div className="flex items-center gap-2 bg-[#07111F] px-4 py-2 rounded-xl border border-[#1E293B]">
              <Calendar className="w-4 h-4 text-[#0878FF]" />
              <span>29 September 2026</span>
            </div>
            <div className="flex items-center gap-2 bg-[#07111F] px-4 py-2 rounded-xl border border-[#1E293B]">
              <Clock className="w-4 h-4 text-[#0878FF]" />
              <span>9:00 AM – 4:00 PM</span>
            </div>
            <div className="flex items-center gap-2 bg-[#07111F] px-4 py-2 rounded-xl border border-[#1E293B]">
              <MapPin className="w-4 h-4 text-[#0878FF]" />
              <span>Lecture Theatre (33220B)</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={() => onNavigate('/register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-[#0878FF] via-[#00B4FF] to-[#0878FF] hover:brightness-110 shadow-[0_0_25px_rgba(8,120,255,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
            >
              REGISTER NOW
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('/about')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-base text-[#D9E2F0] hover:text-white bg-[#0F1C34]/80 hover:bg-[#0F1C34] border border-[#1E293B] hover:border-[#0878FF]/50 transition-all flex items-center justify-center gap-2"
            >
              EXPLORE EVENT
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. EVENT QUICK INFO BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-[#07111F] border border-[#1E293B] shadow-xl">
          <div className="p-3 border-r border-[#1E293B]/60 last:border-0">
            <div className="flex items-center gap-2 text-[#7F8DA3] text-xs font-semibold uppercase mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#0878FF]" />
              Date
            </div>
            <p className="text-sm font-bold text-white">29 Sep 2026</p>
            <span className="text-[11px] text-[#7F8DA3]">Tuesday</span>
          </div>

          <div className="p-3 border-r border-[#1E293B]/60 last:border-0">
            <div className="flex items-center gap-2 text-[#7F8DA3] text-xs font-semibold uppercase mb-1">
              <Clock className="w-3.5 h-3.5 text-[#0878FF]" />
              Time
            </div>
            <p className="text-sm font-bold text-white">9:00 AM – 4:00 PM</p>
            <span className="text-[11px] text-[#7F8DA3]">Full-day Event</span>
          </div>

          <div className="p-3 border-r border-[#1E293B]/60 last:border-0">
            <div className="flex items-center gap-2 text-[#7F8DA3] text-xs font-semibold uppercase mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#0878FF]" />
              Venue
            </div>
            <p className="text-sm font-bold text-white">LT (33220B)</p>
            <span className="text-[11px] text-[#7F8DA3]">School of Computing</span>
          </div>

          <div className="p-3 border-r border-[#1E293B]/60 last:border-0">
            <div className="flex items-center gap-2 text-[#7F8DA3] text-xs font-semibold uppercase mb-1">
              <BrainCircuit className="w-3.5 h-3.5 text-[#00C8FF]" />
              Rounds
            </div>
            <p className="text-sm font-bold text-white">3 Rounds</p>
            <span className="text-[11px] text-[#7F8DA3]">MCQ • Debug • Pitch</span>
          </div>

          <div className="p-3 border-r border-[#1E293B]/60 last:border-0">
            <div className="flex items-center gap-2 text-[#FFB800] text-xs font-semibold uppercase mb-1">
              <Trophy className="w-3.5 h-3.5 text-[#FFB800]" />
              Prize Pool
            </div>
            <p className="text-sm font-bold text-[#FFB800]">₹5,250</p>
            <span className="text-[11px] text-[#7F8DA3]">Cash & Certificates</span>
          </div>

          <div className="p-3">
            <div className="flex items-center gap-2 text-[#7F8DA3] text-xs font-semibold uppercase mb-1">
              <Users className="w-3.5 h-3.5 text-[#00C8FF]" />
              Registrations
            </div>
            <p className="text-sm font-bold text-white">
              {eventInfo ? `${eventInfo.registered_count} Registered` : '100+ Capacity'}
            </p>
            <span className="text-[11px] text-emerald-400 font-medium">● Open to All Years</span>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION & VISUAL JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#00C8FF] mb-2">
            WHAT IS CODE MASTERS?
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Premier Technical Challenge at Vel Tech
          </h3>
          <p className="text-[#D9E2F0]/80 mt-4 text-base leading-relaxed">
            Code Masters is an intensive one-day technical coding challenge organized by the{' '}
            <strong className="text-white font-semibold">
              Department of Computer Science and Engineering (Artificial Intelligence and Machine Learning)
            </strong>
            , School of Computing, Vel Tech University. Designed to evaluate practical programming aptitude,
            algorithmic diagnostics, and live technical defense.
          </p>
        </div>

        {/* Visual Journey: THINK -> SOLVE -> DEBUG -> PRESENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1E293B] hover:border-[#0878FF]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#0F1C34] border border-[#0878FF]/40 text-[#00C8FF] flex items-center justify-center font-extrabold text-lg mb-4 group-hover:scale-110 transition-transform">
              01
            </div>
            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              THINK
              <span className="text-xs text-[#0878FF] font-mono">/theory</span>
            </h4>
            <p className="text-sm text-[#7F8DA3] leading-relaxed">
              Deconstruct 25 Python-centric problems. Analyze execution behavior, variable scoping, data structures, and edge cases.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1E293B] hover:border-[#0878FF]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#0F1C34] border border-[#0878FF]/40 text-[#00C8FF] flex items-center justify-center font-extrabold text-lg mb-4 group-hover:scale-110 transition-transform">
              02
            </div>
            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              SOLVE
              <span className="text-xs text-[#0878FF] font-mono">/logic</span>
            </h4>
            <p className="text-sm text-[#7F8DA3] leading-relaxed">
              Evaluate output predictions, algorithmic time complexities, and core Python language paradigms under timed conditions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1E293B] hover:border-[#0878FF]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#0F1C34] border border-[#0878FF]/40 text-[#00C8FF] flex items-center justify-center font-extrabold text-lg mb-4 group-hover:scale-110 transition-transform">
              03
            </div>
            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              DEBUG
              <span className="text-xs text-[#0878FF] font-mono">/sandbox</span>
            </h4>
            <p className="text-sm text-[#7F8DA3] leading-relaxed">
              Dive into 5 broken Python programs. Identify off-by-one errors, stack defects, and logic flaws in our browser IDE.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1E293B] hover:border-[#0878FF]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#0F1C34] border border-[#0878FF]/40 text-[#FFB800] flex items-center justify-center font-extrabold text-lg mb-4 group-hover:scale-110 transition-transform">
              04
            </div>
            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              PRESENT
              <span className="text-xs text-[#FFB800] font-mono">/jury</span>
            </h4>
            <p className="text-sm text-[#7F8DA3] leading-relaxed">
              Defend your algorithms, architecture, and engineering choices in front of the distinguished faculty jury panel.
            </p>
          </div>
        </div>
      </section>

      {/* 4. THREE ROUNDS BREAKDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0878FF]/10 text-[#00C8FF] text-xs font-semibold tracking-wider uppercase mb-2">
            Structured Elimination
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Three Rounds. One Challenge.
          </h2>
          <p className="text-[#7F8DA3] mt-2">
            Engineered to thoroughly evaluate fundamental comprehension and real-time execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Round 1 */}
          <div className="flex flex-col justify-between p-8 rounded-2xl bg-[#07111F] border border-[#1E293B] hover:border-[#0878FF]/60 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-[#0878FF]/20 border-l border-b border-[#0878FF]/40 text-xs font-mono font-bold text-[#00C8FF]">
              30 MINS
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0F1C34] border border-[#0878FF]/40 text-[#00C8FF] flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#00C8FF] uppercase tracking-widest">
                ROUND 01
              </span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                MCQ Challenge
              </h3>
              <p className="text-sm font-semibold text-[#D9E2F0] mb-4">
                25 Python Questions
              </p>
              <p className="text-xs text-[#7F8DA3] leading-relaxed mb-6">
                Tests programming logic, operator precedence, memory references, dictionaries, generators, OOP, and output predictions.
              </p>
              <ul className="space-y-2 text-xs text-[#D9E2F0]/90 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0878FF]" />
                  <span>Sequential, distraction-free interface</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0878FF]" />
                  <span>Anti-tab switch violation tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0878FF]" />
                  <span>Automated instant scoring</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('/rounds')}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[#00C8FF] bg-[#0F1C34] hover:bg-[#0878FF]/20 border border-[#0878FF]/30 transition-all"
            >
              View Round 1 Details
            </button>
          </div>

          {/* Round 2 */}
          <div className="flex flex-col justify-between p-8 rounded-2xl bg-[#07111F] border border-[#1E293B] hover:border-[#0878FF]/60 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-[#0878FF]/20 border-l border-b border-[#0878FF]/40 text-xs font-mono font-bold text-[#00C8FF]">
              45 MINS
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0F1C34] border border-[#0878FF]/40 text-[#00C8FF] flex items-center justify-center mb-6">
                <Bug className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#00C8FF] uppercase tracking-widest">
                ROUND 02
              </span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                Debugging Arena
              </h3>
              <p className="text-sm font-semibold text-[#D9E2F0] mb-4">
                5 Buggy Python Programs
              </p>
              <p className="text-xs text-[#7F8DA3] leading-relaxed mb-6">
                Participants receive broken programs with logic defects. Identify errors, modify code inside Monaco Editor, and submit against automated test cases.
              </p>
              <ul className="space-y-2 text-xs text-[#D9E2F0]/90 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0878FF]" />
                  <span>Isolated Linux execution sandbox</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0878FF]" />
                  <span>Visible + hidden automated test cases</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0878FF]" />
                  <span>CPU & memory limit enforcement</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('/rounds')}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[#00C8FF] bg-[#0F1C34] hover:bg-[#0878FF]/20 border border-[#0878FF]/30 transition-all"
            >
              View Round 2 Details
            </button>
          </div>

          {/* Round 3 */}
          <div className="flex flex-col justify-between p-8 rounded-2xl bg-[#07111F] border border-[#1E293B] hover:border-[#FFB800]/50 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-[#FFB800]/20 border-l border-b border-[#FFB800]/40 text-xs font-mono font-bold text-[#FFB800]">
              FINALS
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0F1C34] border border-[#FFB800]/40 text-[#FFB800] flex items-center justify-center mb-6">
                <Presentation className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#FFB800] uppercase tracking-widest">
                ROUND 03
              </span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                Final Presentation
              </h3>
              <p className="text-sm font-semibold text-[#D9E2F0] mb-4">
                Grand Finale Defense
              </p>
              <p className="text-xs text-[#7F8DA3] leading-relaxed mb-6">
                Top qualifying teams present their algorithmic solutions, approach, and code structure before the faculty judging panel.
              </p>
              <div className="p-3.5 rounded-xl bg-[#0F1C34]/80 border border-[#1E293B] mb-6">
                <p className="text-xs text-[#FFB800] font-medium leading-relaxed">
                  Notice: Final presentation format and problem statements will be officially announced by the organizers.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/rounds')}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[#FFB800] bg-[#0F1C34] hover:bg-[#FFB800]/10 border border-[#FFB800]/40 transition-all"
            >
              View Round 3 Format
            </button>
          </div>
        </div>
      </section>

      {/* 5. OFFICIAL PRIZES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#07111F] to-[#050B14] border border-[#1E293B] shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFB800]/10 text-[#FFB800] text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5" />
              Official Recognition
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ₹5,250 Total Prize Pool
            </h2>
            <p className="text-sm text-[#7F8DA3] mt-2">
              Cash prizes, victory trophies, and certificates of excellence awarded at the valedictory ceremony.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1st Place */}
            <div className="p-6 rounded-2xl bg-[#0F1C34] border-2 border-[#FFB800] relative text-center shadow-[0_0_25px_rgba(255,184,0,0.15)] transform hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FFB800]/20 text-[#FFB800] flex items-center justify-center font-extrabold text-xl mb-3">
                1st
              </div>
              <h4 className="text-lg font-bold text-white">Winner</h4>
              <p className="text-3xl font-extrabold text-[#FFB800] my-2">₹2,000</p>
              <p className="text-xs text-[#D9E2F0]">Winner Trophy + Cash Prize + Merit Certificate</p>
            </div>

            {/* 2nd Place */}
            <div className="p-6 rounded-2xl bg-[#07111F] border border-[#00C8FF]/50 text-center transform hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#00C8FF]/20 text-[#00C8FF] flex items-center justify-center font-extrabold text-xl mb-3">
                2nd
              </div>
              <h4 className="text-lg font-bold text-white">Runner-up</h4>
              <p className="text-3xl font-extrabold text-[#00C8FF] my-2">₹1,500</p>
              <p className="text-xs text-[#D9E2F0]">Runner-up Award + Cash Prize + Merit Certificate</p>
            </div>

            {/* 3rd Place */}
            <div className="p-6 rounded-2xl bg-[#07111F] border border-[#0878FF]/50 text-center transform hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0878FF]/20 text-[#0878FF] flex items-center justify-center font-extrabold text-xl mb-3">
                3rd
              </div>
              <h4 className="text-lg font-bold text-white">Second Runner-up</h4>
              <p className="text-3xl font-extrabold text-[#0878FF] my-2">₹1,000</p>
              <p className="text-xs text-[#D9E2F0]">Award + Cash Prize + Merit Certificate</p>
            </div>

            {/* 4th Place */}
            <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1E293B] text-center transform hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#7F8DA3]/20 text-[#D9E2F0] flex items-center justify-center font-extrabold text-xl mb-3">
                4th
              </div>
              <h4 className="text-lg font-bold text-white">Consolation Prize</h4>
              <p className="text-3xl font-extrabold text-white my-2">₹750</p>
              <p className="text-xs text-[#D9E2F0]">Cash Prize + Certificate of Special Merit</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0878FF]/20 via-[#07111F] to-[#00C8FF]/20 border border-[#0878FF]/40 text-center space-y-6 shadow-2xl">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Prove Your Python Mastery?
          </h3>
          <p className="text-sm sm:text-base text-[#D9E2F0] max-w-2xl mx-auto leading-relaxed">
            Join fellow undergraduate coders at Vel Tech University on 29 September 2026. Register your team now and secure your spot in the competition.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('/register')}
              className="px-8 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0878FF] to-[#00C8FF] hover:brightness-110 shadow-[0_0_20px_rgba(8,120,255,0.4)] transition-all"
            >
              REGISTER YOUR TEAM
            </button>
            <button
              onClick={() => onNavigate('/rules')}
              className="px-8 py-3 rounded-xl font-semibold text-sm text-[#D9E2F0] hover:text-white bg-[#0F1C34] border border-[#1E293B] hover:border-[#0878FF]/50 transition-all"
            >
              VIEW EVENT RULES
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { ShieldCheck, BrainCircuit, Terminal, Sparkles, MapPin, Calendar, Clock, Award, Users } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0878FF]/10 border border-[#0878FF]/30 text-[#00C8FF] text-xs font-semibold tracking-wider uppercase mb-3">
          ABOUT THE EVENT
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Code Masters 2026
        </h1>
        <p className="text-lg text-[#0878FF] font-semibold mt-2">
          “The Ultimate Coding Challenge”
        </p>
        <p className="text-[#D9E2F0]/80 mt-4 leading-relaxed">
          An elite university-level technical competition organized by the Department of Computer Science and
          Engineering (Artificial Intelligence and Machine Learning), School of Computing, Vel Tech University, Avadi, Chennai.
        </p>
      </div>

      {/* Institutional Profile */}
      <div className="p-8 rounded-3xl bg-[#07111F] border border-[#1E293B] shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#00C8FF]">
              ORGANIZING BODY
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Dept. of CSE (AI & ML)
            </h3>
            <p className="text-sm font-medium text-[#D9E2F0]">
              School of Computing • Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology
            </p>
            <p className="text-xs text-[#7F8DA3] leading-relaxed">
              The Department of CSE (AI & ML) is dedicated to fostering deep computational thinking, algorithmic mastery, and practical intelligence in computer science students. Code Masters was envisioned to break away from traditional multiple-choice hackathons by introducing a hybrid competition that rigorously measures analytical logic, real-time code diagnosis, and oral technical articulation.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#D9E2F0]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00C8FF]" />
                <span>Vel Tech Academic Wing</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FFB800]" />
                <span>Official Department Event</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1C34] border border-[#1E293B] space-y-4 text-xs">
            <h4 className="font-bold text-white text-sm">Event Logistics at a Glance</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Event Date:</span>
                  <p className="text-[#7F8DA3]">29 September 2026 (Tuesday)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Hours:</span>
                  <p className="text-[#7F8DA3]">9:00 AM – 4:00 PM IST (Reporting at 8:45 AM)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Official Venue:</span>
                  <p className="text-[#7F8DA3]">Lecture Theatre (33220B), School of Computing, Vel Tech University, Avadi, Chennai</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-[#00C8FF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Eligibility:</span>
                  <p className="text-[#7F8DA3]">Open to all undergraduate engineering students across departments and years</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Four Core Competencies Evaluated */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#00C8FF] mb-2">
            EVALUATION PHILOSOPHY
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Core Competencies Tested
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1E293B]">
            <div className="w-10 h-10 rounded-xl bg-[#0878FF]/20 text-[#00C8FF] flex items-center justify-center font-bold mb-4">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Python Fundamentals</h4>
            <p className="text-xs text-[#7F8DA3] leading-relaxed">
              Evaluates in-depth grasp of mutable vs immutable data types, list comprehensions, lambda closures, generator pipelines, and runtime scopes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1E293B]">
            <div className="w-10 h-10 rounded-xl bg-[#0878FF]/20 text-[#00C8FF] flex items-center justify-center font-bold mb-4">
              <Terminal className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Algorithmic Diagnostics</h4>
            <p className="text-xs text-[#7F8DA3] leading-relaxed">
              Tests candidate ability to read someone else’s flawed code, spot memory leaks, infinite recursions, edge-case failures, and fix them under timed pressure.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1E293B]">
            <div className="w-10 h-10 rounded-xl bg-[#0878FF]/20 text-[#00C8FF] flex items-center justify-center font-bold mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Execution Speed</h4>
            <p className="text-xs text-[#7F8DA3] leading-relaxed">
              Measures quick problem identification, low debugging turnaround, and disciplined syntax mastery without relying on external copilot search engines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1E293B]">
            <div className="w-10 h-10 rounded-xl bg-[#FFB800]/20 text-[#FFB800] flex items-center justify-center font-bold mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Technical Defense</h4>
            <p className="text-xs text-[#7F8DA3] leading-relaxed">
              Shortlisted candidates must present their algorithmic approaches directly to senior professors, justifying time and space complexities clearly.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-2xl bg-[#0F1C34] border border-[#0878FF]/40 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white">Experience Code Masters 2026</h3>
        <p className="text-xs sm:text-sm text-[#D9E2F0] max-w-xl mx-auto">
          Registrations are now open for teams and solo coders. Test your mettle in Chennai's premier Python arena.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('/register')}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0878FF] to-[#00C8FF]"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

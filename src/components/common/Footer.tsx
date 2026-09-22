import React from 'react';
import { CodeMastersLogo } from './CodeMastersLogo.tsx';
import { MapPin, Calendar, Clock, Trophy, ShieldCheck, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#1E293B] bg-[#07111F] text-[#D9E2F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Organizer */}
          <div className="space-y-4">
            <CodeMastersLogo variant="footer" />
            <p className="text-xs text-[#7F8DA3] leading-relaxed">
              Official university technical competition organized by the Department of Computer Science and Engineering
              (Artificial Intelligence and Machine Learning), School of Computing, Vel Tech University.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#00C8FF]">
              <ShieldCheck className="w-4 h-4 text-[#00C8FF]" />
              <span>Certified Academic Technical Event</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#00C8FF] mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#D9E2F0]/80">
              {['Home', 'About', 'Rounds', 'Timeline', 'Prizes', 'Rules', 'FAQ'].map((item) => {
                const path = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
                return (
                  <li key={item}>
                    <button
                      onClick={() => {
                        onNavigate(path);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white hover:underline transition-all text-left"
                    >
                      {item}
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={() => {
                    onNavigate('/admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-[#FFB800] hover:underline"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Event Schedule & Venue */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#00C8FF] mb-4">
              Event Details
            </h4>
            <ul className="space-y-3 text-xs text-[#D9E2F0]/90">
              <li className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">29 September 2026</span>
                  <p className="text-[#7F8DA3]">Tuesday</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">9:00 AM – 4:00 PM</span>
                  <p className="text-[#7F8DA3]">Reporting time: 8:45 AM</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0878FF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Lecture Theatre (33220B)</span>
                  <p className="text-[#7F8DA3]">School of Computing, Vel Tech University, Avadi, Chennai</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Trophy className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#FFB800]">₹5,250 Prize Pool</span>
                  <p className="text-[#7F8DA3]">Cash prizes & certificates for top 4 teams</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: University Credentials & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#00C8FF] mb-4">
              Institution
            </h4>
            <div className="p-4 rounded-xl bg-[#0F1C34]/60 border border-[#1E293B] space-y-2 text-xs">
              <p className="font-bold text-white leading-tight">
                Department of CSE (AI & ML)
              </p>
              <p className="text-[#7F8DA3]">
                School of Computing
              </p>
              <p className="text-[#D9E2F0]">
                Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology
              </p>
              <p className="text-[11px] text-[#7F8DA3] pt-1">
                400 Feet Outer Ring Road, Avadi, Chennai, Tamil Nadu 600062
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#1E293B]/70 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7F8DA3] gap-4">
          <p>© 2026 Code Masters — Department of CSE (AI & ML), Vel Tech University. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Academic Competition Platform</span>
            <span>•</span>
            <span className="text-[#00C8FF]">Python 3 Arena</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

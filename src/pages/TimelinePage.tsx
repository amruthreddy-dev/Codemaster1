import React from 'react';
import { TimelineEvent } from '../types.ts';
import { Clock, Calendar, MapPin, CheckCircle2, PlayCircle, AlertCircle } from 'lucide-react';

interface TimelinePageProps {
  timeline: TimelineEvent[];
  onNavigate: (path: string) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ timeline, onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0878FF]/10 border border-[#0878FF]/30 text-[#00C8FF] text-xs font-semibold tracking-wider uppercase mb-3">
          OFFICIAL SCHEDULE
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Event Timeline
        </h1>
        <p className="text-[#D9E2F0]/80 mt-3 text-sm">
          29 September 2026 • 9:00 AM to 4:00 PM • Lecture Theatre (33220B)
        </p>
      </div>

      {/* Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#07111F] border border-[#1E293B]">
        <div className="flex items-center gap-2 text-xs text-[#D9E2F0]">
          <Calendar className="w-4 h-4 text-[#0878FF]" />
          <span className="font-semibold text-white">Date:</span> 29 September 2026
        </div>
        <div className="flex items-center gap-2 text-xs text-[#D9E2F0]">
          <Clock className="w-4 h-4 text-[#0878FF]" />
          <span className="font-semibold text-white">Reporting Time:</span> 8:45 AM Sharp
        </div>
        <div className="flex items-center gap-2 text-xs text-[#D9E2F0]">
          <MapPin className="w-4 h-4 text-[#0878FF]" />
          <span className="font-semibold text-white">Venue:</span> LT (33220B), School of Computing
        </div>
      </div>

      {/* Interactive Timeline List */}
      <div className="relative border-l-2 border-[#1E293B] ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-8">
        {timeline.map((item, index) => {
          let statusBadge = (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1E293B] text-[#7F8DA3] uppercase tracking-wider">
              Upcoming
            </span>
          );

          let circleColor = 'bg-[#1E293B] border-[#7F8DA3]';

          if (item.status === 'live') {
            statusBadge = (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00C8FF]/20 text-[#00C8FF] border border-[#00C8FF]/40 uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C8FF]" />
                In Progress Now
              </span>
            );
            circleColor = 'bg-[#0878FF] border-[#00C8FF] ring-4 ring-[#0878FF]/30';
          } else if (item.status === 'completed') {
            statusBadge = (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                Completed
              </span>
            );
            circleColor = 'bg-emerald-500 border-emerald-400';
          }

          return (
            <div key={item.id || index} className="relative group">
              {/* Bullet Node */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 ${circleColor} transition-transform group-hover:scale-125`}
              />

              {/* Content Card */}
              <div className="p-6 rounded-2xl bg-[#07111F] border border-[#1E293B] hover:border-[#0878FF]/50 transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[#00C8FF]">
                      {item.start_time} – {item.end_time}
                    </span>
                    {statusBadge}
                  </div>
                  <span className="text-xs text-[#7F8DA3] font-mono">
                    Slot #{index + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#00C8FF] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#7F8DA3] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="p-4 rounded-xl bg-[#0F1C34] border border-[#1E293B] text-xs text-[#7F8DA3] flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-[#00C8FF] shrink-0" />
        <span>
          Please ensure all participants arrive at least 15 minutes before their scheduled round for credential verification and workstation seating.
        </span>
      </div>
    </div>
  );
};

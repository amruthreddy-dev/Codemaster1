import React, { useState, useEffect } from 'react';

interface VelTechLogoProps {
  variant?: 'navbar' | 'crest' | 'badge' | 'horizontal' | 'full';
  className?: string;
  showText?: boolean;
}

export const VelTechLogo: React.FC<VelTechLogoProps> = ({
  variant = 'navbar',
  className = '',
  showText = true,
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('custom_veltech_logo');
    if (saved) setCustomLogo(saved);
  }, []);

  // If a custom image was provided/uploaded by the user
  if (customLogo) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src={customLogo}
          alt="Vel Tech University Logo"
          className="h-9 w-auto object-contain max-w-[160px]"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // 1. NAVBAR COMPACT VARIANT
  if (variant === 'navbar') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {/* Crest */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#0F284E] to-[#08182E] border border-[#FFD700]/60 p-1 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,215,0,0.2)]">
          <svg viewBox="0 0 50 60" className="w-full h-full" fill="none">
            <path
              d="M25,2 L46,10 C46,38 35,52 25,58 C15,52 4,38 4,10 Z"
              fill="#0F284E"
              stroke="#FFD700"
              strokeWidth="2"
            />
            {/* Sun Rays */}
            <circle cx="25" cy="22" r="4.5" fill="#FFD700" />
            <path d="M25,10 L25,15 M17,14 L20,18 M33,14 L30,18" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
            {/* Book */}
            <path d="M25,32 C21,29 15,29 13,31 L13,41 C16,39 21,39 25,42 C29,39 34,39 37,41 L37,31 C35,29 29,29 25,32 Z" fill="#FFFFFF" />
          </svg>
        </div>

        {showText && (
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1 leading-tight">
              <span className="text-xs font-black text-white tracking-wider">VEL TECH</span>
              <span className="text-[10px] font-bold text-[#FFD700] uppercase tracking-widest">UNIV</span>
            </div>
            <span className="text-[8.5px] font-semibold text-[#00C8FF] tracking-tight truncate max-w-[130px]">
              CSE (AI &amp; ML)
            </span>
          </div>
        )}
      </div>
    );
  }

  // 2. CREST ONLY (Circular / Shield)
  if (variant === 'crest') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-[#0F284E] to-[#071120] border-2 border-[#FFD700] p-2.5 shadow-2xl flex items-center justify-center">
          <svg viewBox="0 0 70 80" className="w-full h-full" fill="none">
            <path
              d="M35,3 L64,13 C64,48 49,65 35,74 C21,65 6,48 6,13 Z"
              fill="#0F284E"
              stroke="#FFD700"
              strokeWidth="2.5"
            />
            <path
              d="M35,8 L59,17 C59,45 46,59 35,67 C24,59 11,45 11,17 Z"
              fill="none"
              stroke="#00C8FF"
              strokeWidth="1"
              opacity="0.6"
            />
            {/* Rising Sun */}
            <circle cx="35" cy="27" r="6" fill="#FFD700" />
            <path d="M35,13 L35,19 M23,18 L27,23 M47,18 L43,23" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
            {/* Open Book */}
            <path
              d="M35,42 C30,38 21,38 18,40 L18,54 C23,52 30,52 35,56 C40,52 47,52 52,54 L52,40 C49,38 40,38 35,42 Z"
              fill="#FFFFFF"
            />
            <path d="M35,42 L35,56" stroke="#08182E" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    );
  }

  // 3. BADGE / SEAL
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F284E]/70 border border-[#FFD700]/50 shadow-md ${className}`}>
        <div className="w-4 h-4 rounded-full bg-[#FFD700] text-black font-black text-[9px] flex items-center justify-center">
          VT
        </div>
        <span className="text-xs font-bold text-white tracking-wide">
          Vel Tech University
        </span>
        <span className="text-[10px] text-[#00C8FF] font-semibold border-l border-[#FFD700]/40 pl-2">
          CSE (AI &amp; ML)
        </span>
      </div>
    );
  }

  // 4. FULL INSTITUTIONAL LOCKUP (Used in Hero, About, and Footer)
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Official Shield */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#0F284E] to-[#08182E] border-2 border-[#FFD700] p-1.5 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,215,0,0.25)]">
        <svg viewBox="0 0 50 60" className="w-full h-full" fill="none">
          <path
            d="M25,2 L46,10 C46,38 35,52 25,58 C15,52 4,38 4,10 Z"
            fill="#0F284E"
            stroke="#FFD700"
            strokeWidth="2"
          />
          <circle cx="25" cy="22" r="4.5" fill="#FFD700" />
          <path d="M25,10 L25,15 M17,14 L20,18 M33,14 L30,18" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M25,32 C21,29 15,29 13,31 L13,41 C16,39 21,39 25,42 C29,39 34,39 37,41 L37,31 C35,29 29,29 25,32 Z" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-black text-white tracking-tight">Vel Tech</span>
          <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider">University</span>
        </div>
        <span className="text-[10px] font-semibold text-[#00C8FF] tracking-wide leading-tight">
          School of Computing • Dept. of CSE (AI &amp; ML)
        </span>
        <span className="text-[9px] text-[#7F8DA3]">
          Avadi, Chennai, Tamil Nadu
        </span>
      </div>
    </div>
  );
};

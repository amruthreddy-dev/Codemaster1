import React from 'react';

interface LogoProps {
  variant?: 'navbar' | 'hero' | 'compact' | 'footer';
  className?: string;
}

export const CodeMastersLogo: React.FC<LogoProps> = ({ variant = 'navbar', className = '' }) => {
  // SVG Graphic Element representing the official Code Masters logo (< CODE MASTERS </> >)
  const LogoSVG = ({ idPrefix = 'cm', svgClass = 'w-auto h-full' }: { idPrefix?: string; svgClass?: string }) => (
    <svg
      viewBox="0 0 1000 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={svgClass}
      role="img"
      aria-label="Code Masters Logo"
    >
      <defs>
        {/* Outer Brackets Gradient */}
        <linearGradient id={`${idPrefix}Bracket`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="50%" stopColor="#0094FF" />
          <stop offset="100%" stopColor="#004DF5" />
        </linearGradient>

        {/* MASTERS Vibrant Gradient */}
        <linearGradient id={`${idPrefix}Masters`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00EEFF" />
          <stop offset="35%" stopColor="#00C0FF" />
          <stop offset="70%" stopColor="#0077FF" />
          <stop offset="100%" stopColor="#004DF5" />
        </linearGradient>

        {/* CODE Pure Bright Sheen Gradient */}
        <linearGradient id={`${idPrefix}Code`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="75%" stopColor="#F2F9FF" />
          <stop offset="100%" stopColor="#CBE6FE" />
        </linearGradient>

        {/* Horizontal Lines Gradients */}
        <linearGradient id={`${idPrefix}LineL`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0080FF" />
        </linearGradient>
        <linearGradient id={`${idPrefix}LineR`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0080FF" />
          <stop offset="100%" stopColor="#004DF5" stopOpacity="0.9" />
        </linearGradient>

        {/* Ambient Shadow for CODE */}
        <filter id={`${idPrefix}Shadow`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#0088FF" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Left Outer Bracket < */}
      <path
        d="M 194,84 L 48,240 L 194,396 L 194,324 L 118,240 L 194,156 Z"
        fill={`url(#${idPrefix}Bracket)`}
      />

      {/* Right Outer Bracket > */}
      <path
        d="M 806,84 L 952,240 L 806,396 L 806,324 L 882,240 L 806,156 Z"
        fill={`url(#${idPrefix}Bracket)`}
      />

      {/* CODE Word */}
      <g fill={`url(#${idPrefix}Code)`} filter={`url(#${idPrefix}Shadow)`}>
        {/* C */}
        <path d="M 342,116 L 260,116 C 240,116 228,128 228,148 L 228,188 C 228,208 240,220 260,220 L 342,220 L 342,192 L 265,192 C 257,192 254,188 254,182 L 254,154 C 254,148 257,144 265,144 L 342,144 Z" />

        {/* O */}
        <path d="M 398,116 L 454,116 C 474,116 486,128 486,148 L 486,188 C 486,208 474,220 454,220 L 398,220 C 378,220 366,208 366,188 L 366,148 C 366,128 378,116 398,116 Z M 402,144 C 395,144 392,148 392,154 L 392,182 C 392,188 395,192 402,192 L 450,192 C 457,192 460,188 460,182 L 460,154 C 460,148 457,144 450,144 Z" />

        {/* D */}
        <path d="M 510,116 L 576,116 C 606,116 626,132 626,168 C 626,204 606,220 576,220 L 510,220 Z M 536,144 L 536,192 L 572,192 C 592,192 600,182 600,168 C 600,154 592,144 572,144 Z" />

        {/* E */}
        <path d="M 648,116 L 762,116 L 762,144 L 674,144 L 674,154 L 748,154 L 748,180 L 674,180 L 674,192 L 764,192 L 764,220 L 648,220 Z" />
      </g>

      {/* MASTERS Word */}
      <g fill={`url(#${idPrefix}Masters)`}>
        {/* M */}
        <path d="M 204,248 L 226,248 L 247,294 L 268,248 L 290,248 L 290,336 L 268,336 L 268,284 L 253,314 L 241,314 L 226,284 L 226,336 L 204,336 Z" />

        {/* A (stylized triangular stencil cutout) */}
        <path d="M 333,248 L 349,248 L 384,336 L 360,336 L 341,290 L 322,336 L 298,336 Z" />

        {/* S */}
        <path d="M 400,248 L 450,248 L 466,264 L 466,282 L 418,282 L 418,290 L 466,298 L 466,336 L 416,336 L 400,320 L 400,302 L 448,302 L 448,294 L 400,286 Z" />

        {/* T */}
        <path d="M 474,248 L 542,248 L 542,270 L 519,270 L 519,336 L 497,336 L 497,270 L 474,270 Z" />

        {/* E */}
        <path d="M 552,248 L 616,248 L 616,270 L 575,270 L 575,281 L 610,281 L 610,303 L 575,303 L 575,314 L 616,314 L 616,336 L 552,336 Z" />

        {/* R */}
        <path d="M 626,248 L 678,248 C 695,248 704,257 704,272 C 704,285 695,293 682,295 L 704,336 L 681,336 L 662,296 L 648,296 L 648,336 L 626,336 Z M 648,268 L 648,278 L 674,278 C 678,278 680,276 680,273 C 680,270 678,268 674,268 Z" />

        {/* S */}
        <path d="M 718,248 L 768,248 L 784,264 L 784,282 L 736,282 L 736,290 L 784,298 L 784,336 L 734,336 L 718,320 L 718,302 L 766,302 L 766,294 L 718,286 Z" />
      </g>

      {/* Accent Divider: Left Line, </>, Right Line */}
      <rect x="215" y="370" width="213" height="4" rx="2" fill={`url(#${idPrefix}LineL)`} />
      <rect x="572" y="370" width="213" height="4" rx="2" fill={`url(#${idPrefix}LineR)`} />

      <g stroke={`url(#${idPrefix}Bracket)`} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* < */}
        <path d="M 466,358 L 444,372 L 466,386" />
        {/* / */}
        <path d="M 488,390 L 512,354" />
        {/* > */}
        <path d="M 534,358 L 556,372 L 534,386" />
      </g>
    </svg>
  );

  // 1. HERO VARIANT (Expansive, cinematic display)
  if (variant === 'hero') {
    return (
      <div className={`relative flex flex-col items-center text-center ${className}`}>
        {/* Ambient neon backlight */}
        <div className="absolute -inset-4 bg-gradient-to-r from-[#00D4FF]/15 via-[#0878FF]/25 to-[#00D4FF]/15 rounded-3xl blur-2xl opacity-80 pointer-events-none" />

        <div className="relative w-full max-w-md sm:max-w-xl md:max-w-2xl py-2 px-4 transition-transform hover:scale-[1.01] duration-300">
          <LogoSVG idPrefix="cmHero" svgClass="w-full h-auto max-h-[170px] drop-shadow-[0_0_35px_rgba(0,212,255,0.35)]" />
        </div>

        <p className="mt-3 text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] text-[#A5C0E8] uppercase drop-shadow-sm">
          THE ULTIMATE CODING CHALLENGE
        </p>
      </div>
    );
  }

  // 2. COMPACT VARIANT (For login modal, cards, or tight spaces)
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <div className="h-10 sm:h-12 w-auto">
          <LogoSVG idPrefix="cmCompact" svgClass="h-full w-auto drop-shadow-[0_0_12px_rgba(0,212,255,0.25)]" />
        </div>
      </div>
    );
  }

  // 3. FOOTER VARIANT
  if (variant === 'footer') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <div className="h-10 sm:h-11 w-auto">
          <LogoSVG idPrefix="cmFooter" svgClass="h-full w-auto drop-shadow-[0_0_10px_rgba(0,212,255,0.2)]" />
        </div>
      </div>
    );
  }

  // 4. NAVBAR DEFAULT VARIANT
  return (
    <div className={`inline-flex items-center select-none group ${className}`}>
      <div className="h-9 sm:h-10 w-auto transition-transform duration-200 group-hover:scale-105">
        <LogoSVG idPrefix="cmNav" svgClass="h-full w-auto drop-shadow-[0_0_15px_rgba(0,212,255,0.3)]" />
      </div>
    </div>
  );
};

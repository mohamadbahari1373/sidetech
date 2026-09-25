import React from 'react';

interface SideTechLogoMarkProps {
  className?: string;
  size?: number;
  showCircuits?: boolean;
}

/**
 * SideTech Vector Emblem
 * Exact geometric match of the uploaded SideTech emblem:
 * - Top circular node ring with center aperture
 * - Direct upward chevron arrow
 * - Central vertical bus stem
 * - Bottom circular node ring with center aperture
 * - Circuit board PCB trace lines with terminal solder nodes
 * - Electric cyan to royal blue gradient with glow
 */
export function SideTechLogoMark({ 
  className = "w-10 h-10", 
  size, 
  showCircuits = true 
}: SideTechLogoMarkProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg 
      viewBox="0 0 220 260" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        {/* Main glyph gradient: electric light cyan down to royal blue */}
        <linearGradient id="st-main-grad" x1="110" y1="30" x2="110" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="20%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {/* Outer radial glow */}
        <filter id="st-emblem-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Circuit traces gradient */}
        <linearGradient id="st-trace-grad" x1="20" y1="30" x2="200" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* PCB Circuit Traces */}
      {showCircuits && (
        <g stroke="url(#st-trace-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* LEFT CIRCUIT TRACES */}
          {/* Trace 1: Top-left high */}
          <path d="M 28 85 H 62 L 78 62 H 92" />
          <circle cx="92" cy="62" r="3" fill="#38bdf8" fillOpacity="0.75" stroke="none" />
          <circle cx="28" cy="85" r="2.2" fill="#38bdf8" fillOpacity="0.5" stroke="none" />

          {/* Trace 2: Top-left vertical bus */}
          <path d="M 44 42 V 76" />
          <circle cx="44" cy="42" r="2.2" fill="#38bdf8" fillOpacity="0.6" stroke="none" />

          {/* Trace 3: Mid-left horizontal */}
          <path d="M 18 128 H 72" />
          <circle cx="72" cy="128" r="3" fill="#3b82f6" fillOpacity="0.75" stroke="none" />
          <circle cx="18" cy="128" r="2" fill="#3b82f6" fillOpacity="0.4" stroke="none" />

          {/* Trace 4: Mid-left low angle */}
          <path d="M 26 172 H 56 L 76 198 H 92" />
          <circle cx="92" cy="198" r="3" fill="#3b82f6" fillOpacity="0.75" stroke="none" />
          <circle cx="26" cy="172" r="2.2" fill="#3b82f6" fillOpacity="0.4" stroke="none" />

          {/* Trace 5: Bottom-left vertical/horizontal */}
          <path d="M 46 222 H 68 L 84 206" />
          <circle cx="46" cy="222" r="2" fill="#2563eb" fillOpacity="0.5" stroke="none" />

          {/* RIGHT CIRCUIT TRACES */}
          {/* Trace 1: Top-right high */}
          <path d="M 192 85 H 158 L 142 62 H 128" />
          <circle cx="128" cy="62" r="3" fill="#38bdf8" fillOpacity="0.75" stroke="none" />
          <circle cx="192" cy="85" r="2.2" fill="#38bdf8" fillOpacity="0.5" stroke="none" />

          {/* Trace 2: Top-right vertical bus */}
          <path d="M 176 42 V 76" />
          <circle cx="176" cy="42" r="2.2" fill="#38bdf8" fillOpacity="0.6" stroke="none" />

          {/* Trace 3: Mid-right horizontal */}
          <path d="M 202 128 H 148" />
          <circle cx="148" cy="128" r="3" fill="#3b82f6" fillOpacity="0.75" stroke="none" />
          <circle cx="202" cy="128" r="2" fill="#3b82f6" fillOpacity="0.4" stroke="none" />

          {/* Trace 4: Mid-right low angle */}
          <path d="M 194 172 H 164 L 144 198 H 128" />
          <circle cx="128" cy="198" r="3" fill="#3b82f6" fillOpacity="0.75" stroke="none" />
          <circle cx="194" cy="172" r="2.2" fill="#3b82f6" fillOpacity="0.4" stroke="none" />

          {/* Trace 5: Bottom-right angle */}
          <path d="M 174 222 H 152 L 136 206" />
          <circle cx="174" cy="222" r="2" fill="#2563eb" fillOpacity="0.5" stroke="none" />
        </g>
      )}

      {/* Main SideTech Glyph */}
      <g filter="url(#st-emblem-glow)">
        {/* Top Node Ring: Outer Ø 46, Inner aperture Ø 22 */}
        <path
          d="M 110 32 
             A 23 23 0 1 1 109.9 32 
             Z
             M 110 44 
             A 11 11 0 1 0 110.1 44 
             Z"
          fill="url(#st-main-grad)"
          fillRule="evenodd"
        />

        {/* Connection tab between top node and arrow */}
        <rect x="103" y="74" width="14" height="14" rx="2" fill="url(#st-main-grad)" />

        {/* Upward Chevron Arrowhead */}
        <path
          d="M 110 82 
             L 154 132 
             L 134 132 
             L 110 104 
             L 86 132 
             L 66 132 
             Z"
          fill="url(#st-main-grad)"
        />

        {/* Vertical Center Stem */}
        <rect x="103" y="118" width="14" height="60" rx="3" fill="url(#st-main-grad)" />

        {/* Bottom Node Ring: Outer Ø 46, Inner aperture Ø 22 */}
        <path
          d="M 110 174 
             A 23 23 0 1 1 109.9 174 
             Z
             M 110 186 
             A 11 11 0 1 0 110.1 186 
             Z"
          fill="url(#st-main-grad)"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}

interface SideTechBannerLogoProps {
  className?: string;
  variant?: 'card' | 'transparent';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Full SideTech Brand Composition
 * Renders the exact visual composition of the uploaded logo image:
 * SideTech text on the left, node & circuit emblem on the right, on a deep navy tech canvas
 */
export function SideTechBannerLogo({ 
  className = "", 
  variant = 'card',
  size = 'md'
}: SideTechBannerLogoProps) {
  const isCard = variant === 'card';

  const sizeClasses = {
    sm: {
      pad: 'py-3 px-5 gap-4',
      text: 'text-2xl sm:text-3xl',
      emblem: 'w-12 sm:w-16'
    },
    md: {
      pad: 'py-5 sm:py-6 px-6 sm:px-10 gap-6 sm:gap-10',
      text: 'text-4xl sm:text-5xl md:text-6xl',
      emblem: 'w-20 sm:w-28'
    },
    lg: {
      pad: 'py-7 sm:py-10 px-8 sm:px-14 gap-8 sm:gap-12',
      text: 'text-5xl sm:text-6xl md:text-7xl',
      emblem: 'w-24 sm:w-36'
    }
  }[size];

  return (
    <div 
      className={`relative overflow-hidden rounded-3xl transition-all duration-300 select-none ${
        isCard 
          ? 'bg-[#090f1f] text-white border border-blue-500/25 shadow-2xl shadow-blue-950/60 ring-1 ring-blue-400/10' 
          : 'bg-transparent text-slate-900 dark:text-white'
      } ${className}`}
      dir="ltr"
    >
      {/* Background ambient tech glow matching uploaded image */}
      {isCard && (
        <>
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-cyan-500/20 rounded-full blur-[90px] pointer-events-none" />
          {/* Subtle circuit dot mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />
        </>
      )}

      <div className={`relative z-10 flex items-center justify-center ${sizeClasses.pad}`}>
        
        {/* Wordmark SideTech */}
        <div className="flex items-center">
          <span 
            className={`${sizeClasses.text} font-black tracking-tight`}
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              background: 'linear-gradient(90deg, #60a5fa 0%, #38bdf8 55%, #bae6fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 45px rgba(56, 189, 248, 0.3)'
            }}
          >
            SideTech
          </span>
        </div>

        {/* Emblem Glyph with Circuit Traces */}
        <div className={`${sizeClasses.emblem} aspect-[220/260] shrink-0`}>
          <SideTechLogoMark 
            className="w-full h-full drop-shadow-[0_0_24px_rgba(56,189,248,0.45)]" 
            showCircuits={true} 
          />
        </div>

      </div>
    </div>
  );
}

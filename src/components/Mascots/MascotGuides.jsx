import React from 'react';

/**
 * Tally - Letter Mode & Sequence Tracker Mascot
 */
export function TallyAvatar({ size = 'md', className = '', mood = 'neutral' }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 border border-indigo-400/30 shadow-lg shadow-indigo-950/40 p-1.5 ${sizeMap[size]} ${className}`}>
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        {/* Antenna */}
        <line x1="32" y1="14" x2="32" y2="6" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="5" r="4" fill="#a5b4fc" className={mood === 'happy' ? 'animate-ping' : ''} />
        {/* Head Shell */}
        <rect x="12" y="14" width="40" height="34" rx="10" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
        {/* Face Screen */}
        <rect x="18" y="20" width="28" height="22" rx="6" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />
        {/* Eyes */}
        {mood === 'happy' ? (
          <>
            <path d="M22 30 Q25 25 28 30" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M36 30 Q39 25 42 30" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : mood === 'focused' ? (
          <>
            <line x1="22" y1="29" x2="28" y2="29" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            <line x1="36" y1="29" x2="42" y2="29" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="25" cy="29" r="3" fill="#38bdf8" />
            <circle cx="39" cy="29" r="3" fill="#38bdf8" />
          </>
        )}
        {/* Body Base */}
        <path d="M24 50 L40 50 L36 58 L28 58 Z" fill="#4338ca" />
      </svg>
      {/* Mini status indicator */}
      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
    </div>
  );
}

/**
 * Blip - Signal Vision & Detection Feedback Mascot
 */
export function BlipAvatar({ size = 'md', className = '', active = false, confidence = 0 }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16'
  };

  const glowColor = active 
    ? (confidence > 0.8 ? 'border-emerald-400/50 shadow-emerald-950/50' : 'border-amber-400/50 shadow-amber-950/50')
    : 'border-slate-700 shadow-slate-950/50';

  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-800 via-emerald-900 to-slate-950 border shadow-lg p-1.5 ${glowColor} ${sizeMap[size]} ${className}`}>
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        {/* Outer Sensor Ring */}
        <circle cx="32" cy="32" r="24" stroke={active ? "#10b981" : "#475569"} strokeWidth="2.5" strokeDasharray={active ? "4 3" : "none"} className={active ? "animate-spin" : ""} style={{ animationDuration: '8s' }} />
        {/* Center Orb */}
        <circle cx="32" cy="32" r="16" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
        {/* Iris / Aperture */}
        <circle cx="32" cy="32" r="9" fill={active ? "#2dd4bf" : "#0f766e"} />
        <circle cx="35" cy="29" r="3" fill="#ffffff" />
        {/* Radar Blips */}
        <circle cx="20" cy="18" r="2" fill="#34d399" opacity={active ? "0.8" : "0.2"} />
        <circle cx="45" cy="46" r="2" fill="#34d399" opacity={active ? "0.8" : "0.2"} />
      </svg>
      {active && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-slate-900"></span>
        </span>
      )}
    </div>
  );
}

/**
 * Nudge - Onboarding & Assistive Tips Guide Mascot
 */
export function NudgeAvatar({ size = 'md', className = '', hasTip = false }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-orange-700 to-slate-950 border border-amber-400/30 shadow-lg shadow-amber-950/40 p-1.5 ${sizeMap[size]} ${className}`}>
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        {/* Sparkle Crown */}
        <path d="M32 4 L34 10 L40 12 L34 14 L32 20 L30 14 L24 12 L30 10 Z" fill="#fbbf24" className="animate-pulse" />
        {/* Compass Body */}
        <circle cx="32" cy="36" r="20" fill="#1c1917" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="32" cy="36" r="14" fill="#292524" />
        {/* Compass Needle / Wink */}
        <polygon points="32,26 36,36 32,46 28,36" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <circle cx="32" cy="36" r="3" fill="#fff" />
      </svg>
      {hasTip && (
        <span className="absolute -top-1 -left-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border border-slate-900"></span>
        </span>
      )}
    </div>
  );
}

/**
 * Integrated Mascot Tips Box
 */
export function MascotTipCard({ mascot = 'nudge', title, tip, mood = 'neutral' }) {
  const mascots = {
    tally: {
      name: 'Tally',
      role: 'Sequence Tracker',
      avatar: <TallyAvatar size="md" mood={mood} />,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    blip: {
      name: 'Blip',
      role: 'Vision Monitor',
      avatar: <BlipAvatar size="md" active={true} confidence={0.9} />,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    nudge: {
      name: 'Nudge',
      role: 'ISL Assistant',
      avatar: <NudgeAvatar size="md" hasTip={true} />,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    }
  };

  const current = mascots[mascot] || mascots.nudge;

  return (
    <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-sm">
      <div className="flex-shrink-0">
        {current.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-slate-200 tracking-wide">{current.name}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${current.badgeColor}`}>
            {current.role}
          </span>
        </div>
        {title && <p className="text-xs font-semibold text-slate-300 mb-0.5">{title}</p>}
        <p className="text-xs text-slate-400 leading-relaxed">{tip}</p>
      </div>
    </div>
  );
}

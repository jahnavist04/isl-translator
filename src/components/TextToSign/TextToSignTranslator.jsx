import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Repeat, FastForward, Volume2, Sparkles } from 'lucide-react';
import { ISL_DICTIONARY } from './SignDictionary';

const PRESET_PHRASES = [
  'HELLO',
  'THANK YOU',
  'NAMASTE',
  'YES',
  'NO',
  'WELCOME',
  'HELP',
  'PLEASE',
  'GOODBYE',
  'SIGN 2026'
];

export default function TextToSignTranslator() {
  const [inputText, setInputText] = useState('HELLO ISL');
  const [activeTokens, setActiveTokens] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // 0.5x, 1x, 1.5x, 2x
  const [isLooping, setIsLooping] = useState(false);

  const timerRef = useRef(null);

  // Tokenize text into sequence of signs/letters
  useEffect(() => {
    const clean = inputText.trim().toUpperCase();
    if (!clean) {
      setActiveTokens([]);
      setCurrentIndex(0);
      setIsPlaying(false);
      return;
    }

    // Check if whole text is a phrase in dictionary
    const phraseMatch = ISL_DICTIONARY.find(d => d.code === clean);
    if (phraseMatch) {
      setActiveTokens([phraseMatch]);
      setCurrentIndex(0);
      return;
    }

    // Otherwise split by characters (ignoring unsupported special chars, keeping letters and digits)
    const tokens = [];
    for (const char of clean) {
      if (char === ' ') {
        tokens.push({ code: 'SPACE', label: 'Space', category: 'special', description: 'Brief pause between words' });
      } else {
        const match = ISL_DICTIONARY.find(d => d.code === char);
        if (match) {
          tokens.push(match);
        } else {
          // Fallback token
          tokens.push({ code: char, label: `Sign ${char}`, category: 'letter', description: `Standard fingerspelling for ${char}` });
        }
      }
    }

    setActiveTokens(tokens);
    setCurrentIndex(0);
  }, [inputText]);

  // Playback timer
  useEffect(() => {
    if (isPlaying && activeTokens.length > 0) {
      const intervalMs = Math.max(400, Math.round(1200 / playbackSpeed));
      
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev + 1 < activeTokens.length) {
            return prev + 1;
          } else {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeTokens, playbackSpeed, isLooping]);

  const currentToken = activeTokens[currentIndex] || null;

  const handlePlayToggle = () => {
    if (activeTokens.length === 0) return;
    if (currentIndex >= activeTokens.length - 1 && !isPlaying) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepPrev = () => {
    setIsPlaying(false);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    setCurrentIndex(prev => Math.min(activeTokens.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-900/60 border border-indigo-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              Part 2 • Visual Synthesis
            </span>
            <span className="text-xs text-slate-400 font-medium">Text / Speech → ISL Video Animation</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Text → Sign Language Playback
          </h1>
        </div>

        {/* Text to Sign badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Sequential Sign Playback Active
        </div>
      </div>

      {/* Main Translation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Field & Quick Phrase Selectors (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Type Text or Numbers to Translate:
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value.toUpperCase())}
                placeholder="Type here (e.g. WELCOME TO SIGNSYNC)..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base font-mono-code text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Quick Preset Chips */}
            <div className="mt-4">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Quick ISL Phrases & Digits:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_PHRASES.map(phrase => (
                  <button
                    key={phrase}
                    onClick={() => {
                      setInputText(phrase);
                      setCurrentIndex(0);
                      setIsPlaying(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-600/50 text-xs font-semibold transition-all"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Synchronized Character Sequence Ribbon */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Sign Sequence
              </span>
              <span className="text-xs font-mono text-slate-400">
                Step {activeTokens.length > 0 ? currentIndex + 1 : 0} of {activeTokens.length}
              </span>
            </div>

            {/* Token Tape */}
            <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-950 rounded-xl border border-slate-800/80 min-h-[64px]">
              {activeTokens.length === 0 ? (
                <span className="text-xs text-slate-600 italic px-2">No input characters yet</span>
              ) : (
                activeTokens.map((token, idx) => {
                  const isActive = idx === currentIndex;
                  const isPast = idx < currentIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[44px] h-12 rounded-lg border font-mono-code font-bold transition-all ${
                        isActive
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-950/60 scale-110'
                          : isPast
                          ? 'bg-slate-900 border-slate-800 text-slate-400'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="text-sm">{token.code === 'SPACE' ? '␣' : token.code}</span>
                      <span className="text-[9px] opacity-75 font-sans">
                        {token.code === 'SPACE' ? 'pause' : token.code}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Prominent Visual Sign Player & Controls (6 cols) */}
        <div className="lg:col-span-6 flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl backdrop-blur-md justify-between">
          <div>
            {/* Visual Sign Screen */}
            <div className="relative w-full aspect-[4/3] max-h-[320px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-inner">
              {currentToken ? (
                currentToken.code === 'SPACE' ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 text-2xl font-mono mb-2">
                      ␣
                    </div>
                    <h3 className="text-lg font-bold text-slate-300">Word Space Pause</h3>
                    <p className="text-xs text-slate-500">Resting hand position between words</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <div className="text-7xl font-black text-indigo-400 font-mono leading-none">
                      {currentToken.code}
                    </div>
                    <p className="text-xs text-slate-400 text-center max-w-xs px-2">{currentToken.description}</p>
                  </div>
                )
              ) : (
                <div className="text-center p-6">
                  <p className="text-sm font-semibold text-slate-500">Type text above to start sign animation</p>
                </div>
              )}

              {/* Current Sign Badge Overlay */}
              {currentToken && currentToken.code !== 'SPACE' && (
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center gap-2">
                  <span className="font-mono-code font-bold text-base text-indigo-300">
                    {currentToken.code}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {currentToken.label}
                  </span>
                </div>
              )}
            </div>

            {/* Instruction description under player */}
            {currentToken && currentToken.description && (
              <div className="mt-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-indigo-400 mr-1.5">Action:</span>
                {currentToken.description}
              </div>
            )}
          </div>

          {/* Playback Controls Toolbar */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Step & Play Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title="Reset to Beginning"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleStepPrev}
                disabled={currentIndex === 0}
                title="Previous Sign"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={handlePlayToggle}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-950/50"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'Pause' : 'Play Signs'}</span>
              </button>
              <button
                onClick={handleStepNext}
                disabled={currentIndex >= activeTokens.length - 1}
                title="Next Sign"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Speed Selector & Loop Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[0.5, 1.0, 1.5, 2.0].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                      playbackSpeed === speed
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsLooping(!isLooping)}
                title="Toggle Looping"
                className={`p-2.5 rounded-xl border transition-colors ${
                  isLooping
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

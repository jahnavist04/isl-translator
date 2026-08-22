import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Copy, Delete, Space, RotateCcw, Plus, Check, Play, Pause } from 'lucide-react';

export default function SentenceTray({ currentLetter, isStable, onAppendLetter }) {
  const [text, setText] = useState('');
  const [autoAppend, setAutoAppend] = useState(true);
  const [holdProgress, setHoldProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const holdStartTimeRef = useRef(null);
  const lastAppendedLetterRef = useRef(null);
  const HOLD_DURATION_MS = 1200; // Hold steady for 1.2s to auto-append

  // Handle Auto-Append timer
  useEffect(() => {
    let animationFrame;

    if (autoAppend && isStable && currentLetter) {
      if (holdStartTimeRef.current === null) {
        holdStartTimeRef.current = Date.now();
      }

      const updateProgress = () => {
        const elapsed = Date.now() - holdStartTimeRef.current;
        const progress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
        setHoldProgress(progress);

        if (elapsed >= HOLD_DURATION_MS) {
          // Trigger append
          setText(prev => prev + currentLetter);
          if (onAppendLetter) onAppendLetter(currentLetter);
          lastAppendedLetterRef.current = currentLetter;
          holdStartTimeRef.current = Date.now() + 600; // Throttle pause before next append
          setHoldProgress(0);
        } else {
          animationFrame = requestAnimationFrame(updateProgress);
        }
      };

      animationFrame = requestAnimationFrame(updateProgress);
    } else {
      holdStartTimeRef.current = null;
      setHoldProgress(0);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [autoAppend, isStable, currentLetter, onAppendLetter]);

  const handleManualAppend = () => {
    if (currentLetter) {
      setText(prev => prev + currentLetter);
      if (onAppendLetter) onAppendLetter(currentLetter);
    }
  };

  const handleAddSpace = () => {
    setText(prev => (prev.endsWith(' ') ? prev : prev + ' '));
  };

  const handleBackspace = () => {
    setText(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setText('');
    setHoldProgress(0);
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
  };

  const handleSpeak = () => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
      {/* Tray Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Translated Sentence Tray
          </span>
          {text && (
            <span className="text-[11px] font-mono text-slate-500">
              ({text.length} chars, {text.trim().split(/\s+/).filter(Boolean).length} words)
            </span>
          )}
        </div>

        {/* Auto Append Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={autoAppend}
              onChange={(e) => setAutoAppend(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500"
            />
            <span>Auto-Append on Hold</span>
          </label>
        </div>
      </div>

      {/* Main Text Display Field */}
      <div className="relative min-h-[90px] p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
        <div className="text-xl md:text-2xl font-mono tracking-wide text-slate-100 break-words whitespace-pre-wrap">
          {text ? (
            <span>
              {text}
              <span className="inline-block w-2 h-5 ml-1 bg-indigo-500 animate-pulse align-middle" />
            </span>
          ) : (
            <span className="text-slate-600 italic text-sm font-sans">
              Form signs in front of the camera to build words and sentences here...
            </span>
          )}
        </div>

        {/* Auto Append Progress Indicator */}
        {autoAppend && isStable && currentLetter && (
          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-900">
            <span className="text-[11px] font-medium text-indigo-400">
              Appending '{currentLetter}' in {( (HOLD_DURATION_MS * (1 - holdProgress / 100)) / 1000 ).toFixed(1)}s
            </span>
            <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-75 ease-linear"
                style={{ width: `${holdProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        {/* Left Action Group (Letter manipulation) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleManualAppend}
            disabled={!currentLetter}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add '{currentLetter || '—'}'
          </button>
          <button
            onClick={handleAddSpace}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <Space className="w-4 h-4" />
            Space
          </button>
          <button
            onClick={handleBackspace}
            disabled={!text}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <Delete className="w-4 h-4" />
            Backspace
          </button>
          <button
            onClick={handleClear}
            disabled={!text}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800 disabled:opacity-40 text-slate-400 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>

        {/* Right Action Group (Audio & Export) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeak}
            disabled={!text || isSpeaking}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm shadow-emerald-950/40"
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
            {isSpeaking ? 'Speaking...' : 'Speak'}
          </button>
          <button
            onClick={handleCopy}
            disabled={!text}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

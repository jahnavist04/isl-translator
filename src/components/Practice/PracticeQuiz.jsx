import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Target, Award, ArrowRight, RotateCcw, CheckCircle, Flame, Star, Sparkles } from 'lucide-react';
import WebcamCanvas from '../SignToText/WebcamCanvas';
import { ISL_DICTIONARY } from '../TextToSign/SignDictionary';
import islModelService from '../../services/islModel';

const PRACTICE_POOL = ISL_DICTIONARY.filter(d => d.category === 'letter' || d.category === 'digit');

export default function PracticeQuiz({ initialSignCode = null }) {
  const [targetSign, setTargetSign] = useState(() => {
    if (initialSignCode) {
      return PRACTICE_POOL.find(p => p.code === initialSignCode) || PRACTICE_POOL[0];
    }
    return PRACTICE_POOL[Math.floor(Math.random() * PRACTICE_POOL.length)];
  });

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedList, setCompletedList] = useState([]);
  const [matchHoldProgress, setMatchHoldProgress] = useState(0);
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [currentDetection, setCurrentDetection] = useState(null);

  const holdStartRef = useRef(null);
  const HOLD_GOAL_MS = 1000; // Hold correct sign for 1.0s to score

  // Frame evaluation
  const handleFrame = (landmarks) => {
    if (!landmarks || !islModelService.isLoaded || isSuccessState) {
      setCurrentDetection(null);
      holdStartRef.current = null;
      setMatchHoldProgress(0);
      return;
    }

    const pred = islModelService.predict(landmarks);
    setCurrentDetection(pred);

    if (pred && pred.label === targetSign.code && pred.confidence >= 0.70) {
      if (holdStartRef.current === null) {
        holdStartRef.current = Date.now();
      }

      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(100, (elapsed / HOLD_GOAL_MS) * 100);
      setMatchHoldProgress(progress);

      if (elapsed >= HOLD_GOAL_MS) {
        triggerSuccess();
      }
    } else {
      holdStartRef.current = null;
      setMatchHoldProgress(0);
    }
  };

  const triggerSuccess = () => {
    setIsSuccessState(true);
    setScore(s => s + 100 + streak * 25);
    setStreak(s => s + 1);
    setCompletedList(prev => [...prev, targetSign.code]);

    // Burst celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Advance to next target after 1.5s
    setTimeout(() => {
      pickNextSign();
      setIsSuccessState(false);
      holdStartRef.current = null;
      setMatchHoldProgress(0);
    }, 1500);
  };

  const pickNextSign = () => {
    const remaining = PRACTICE_POOL.filter(p => p.code !== targetSign.code);
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    setTargetSign(next);
  };

  const resetQuiz = () => {
    setScore(0);
    setStreak(0);
    setCompletedList([]);
    pickNextSign();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-slate-900/60 border border-amber-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              Practice Challenge
            </span>
            <span className="text-xs text-slate-400 font-medium">Real-Time AI Sign Evaluation</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Interactive ISL Sign Practice & Quiz
          </h1>
        </div>

        {/* Score & Streak Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-500 block leading-none">SCORE</span>
              <span className="font-mono-code font-bold text-base text-amber-300">{score}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <Flame className="w-4 h-4 text-orange-400" />
            <div>
              <span className="text-[10px] text-slate-500 block leading-none">STREAK</span>
              <span className="font-mono-code font-bold text-base text-orange-400">{streak}x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Challenge Prompt & Guide + Live Webcam Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Challenge Card & Anatomical Reference (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Target Challenge Sign
                </span>
                <h3 className="text-2xl font-black text-white">{targetSign.label}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-mono-code font-black text-2xl text-amber-300">
                {targetSign.code}
              </div>
            </div>

            {/* Hand Pose Diagram */}
            <div className="my-4 w-full h-44 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
              {targetSign.image ? (
                <img src={targetSign.image} alt={targetSign.label} className="w-full h-full object-cover" />
              ) : (
                <div className="text-8xl font-black text-indigo-400 font-mono leading-none select-none">
                  {targetSign.code}
                </div>
              )}
            </div>

            {/* Hint / Instructions */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-300">How to form this sign:</h4>
              <p className="text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {targetSign.description}
              </p>
            </div>
          </div>

          {/* Skip / Next Button */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Score
            </button>
            <button
              onClick={pickNextSign}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-md"
            >
              <span>Skip / Next Sign</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Live Camera Evaluation Feed (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative">
            <WebcamCanvas
              onLandmarksDetected={handleFrame}
              isModelReady={islModelService.isLoaded}
            />

            {/* Success Celebration Overlay */}
            {isSuccessState && (
              <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center z-30 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 mb-3 animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-emerald-200">PERFECT MATCH!</h3>
                <p className="text-sm text-emerald-400 font-mono font-bold mt-1">
                  +{100 + streak * 25} Points
                </p>
              </div>
            )}
          </div>

          {/* Real-time Match Hold Meter */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">
                Current AI Detection:{' '}
                <span className="text-indigo-400 font-mono font-bold text-sm">
                  {currentDetection?.label || '—'}
                </span>
              </span>
              <span className="text-slate-400 font-mono">
                {currentDetection?.confidence ? `${Math.round(currentDetection.confidence * 100)}% match` : '0%'}
              </span>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-75 ease-linear ${
                  matchHoldProgress > 0 ? 'bg-gradient-to-r from-amber-400 to-emerald-400' : 'bg-slate-800'
                }`}
                style={{ width: `${matchHoldProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              Hold the matching sign steady for 1 second to confirm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
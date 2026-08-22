import React from 'react';
import { Activity, CheckCircle2, Zap, HelpCircle } from 'lucide-react';

export default function PredictionHUD({ prediction, rawPrediction, isHandPresent }) {
  // prediction is the smoothed result: { label, rawLabel, confidence, voteCount, isStable, voteDistribution }
  // rawPrediction is the single-frame output: { label, confidence, top3 }

  const hasStableLetter = isHandPresent && prediction && prediction.label;
  const isStabilizing = isHandPresent && !prediction?.label && prediction?.rawLabel;
  const confidencePercent = hasStableLetter 
    ? Math.round(prediction.confidence * 100) 
    : (rawPrediction?.confidence ? Math.round(rawPrediction.confidence * 100) : 0);

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Live Recognition
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium">
          {hasStableLetter ? (
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
              <CheckCircle2 className="w-3 h-3" />
              Locked ({prediction.voteCount}/10 votes)
            </span>
          ) : isStabilizing ? (
            <span className="flex items-center gap-1 text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/50">
              <Activity className="w-3 h-3 animate-pulse" />
              Stabilizing ({prediction?.voteCount || 0}/6 needed)
            </span>
          ) : (
            <span className="text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700/50">
              Idle
            </span>
          )}
        </div>
      </div>

      {/* Main Massive Prediction Display */}
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="relative flex items-center justify-center">
          {/* Subtle background glow when sign is recognized */}
          {hasStableLetter && (
            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse-subtle" />
          )}

          <div className={`relative flex items-center justify-center w-32 h-32 md:w-36 md:h-36 rounded-3xl border transition-all duration-200 ${
            hasStableLetter
              ? 'bg-gradient-to-br from-indigo-900/60 to-slate-900 border-indigo-500/60 shadow-xl shadow-indigo-950/50 scale-105'
              : isStabilizing
              ? 'bg-slate-900/70 border-amber-500/40 shadow-md'
              : 'bg-slate-950/50 border-slate-800'
          }`}>
            <span className={`font-mono-code font-black transition-all ${
              hasStableLetter
                ? 'text-6xl md:text-7xl text-white drop-shadow-[0_4px_12px_rgba(99,102,241,0.5)]'
                : isStabilizing
                ? 'text-5xl md:text-6xl text-amber-300/70'
                : 'text-5xl text-slate-600'
            }`}>
              {hasStableLetter ? prediction.label : (isStabilizing ? prediction.rawLabel : '—')}
            </span>
          </div>
        </div>

        {/* Status description */}
        <div className="mt-4 text-center">
          {!isHandPresent ? (
            <p className="text-xs text-slate-500 font-medium">No hand detected in camera feed</p>
          ) : hasStableLetter ? (
            <p className="text-xs text-indigo-300 font-semibold">
              ISL Sign Confirmed: <span className="text-white font-bold">{prediction.label}</span>
            </p>
          ) : isStabilizing ? (
            <p className="text-xs text-amber-300/80 font-medium">
              Holding sign steady for verification...
            </p>
          ) : (
            <p className="text-xs text-slate-400 font-medium">Form a sign clearly in frame</p>
          )}
        </div>

        {/* Confidence Percentage (Subdued and smaller) */}
        <div className="mt-2 flex items-center gap-2">
          <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-150 ${
                hasStableLetter ? 'bg-indigo-400' : isStabilizing ? 'bg-amber-400' : 'bg-slate-700'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {confidencePercent > 0 ? `${confidencePercent}% match` : '0%'}
          </span>
        </div>
      </div>

      {/* Top 3 Candidate Probabilities */}
      {rawPrediction?.top3 && rawPrediction.top3.length > 0 && isHandPresent && (
        <div className="pt-3 border-t border-slate-800/80">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider flex items-center justify-between">
            <span>Candidate Distribution</span>
            <span className="text-slate-400 font-normal">75% threshold</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {rawPrediction.top3.map((cand, idx) => {
              const candProb = Math.round(cand.confidence * 100);
              const isTop = idx === 0 && cand.confidence >= 0.75;
              return (
                <div 
                  key={cand.label}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    isTop 
                      ? 'bg-indigo-950/40 border-indigo-600/50 text-indigo-200' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-sm font-mono-code font-bold text-slate-100">{cand.label}</div>
                  <div className="text-[10px] text-slate-400">{candProb}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

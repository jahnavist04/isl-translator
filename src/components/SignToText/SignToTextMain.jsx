import React, { useState, useEffect, useCallback, useRef } from 'react';
import WebcamCanvas from './WebcamCanvas';
import PredictionHUD from './PredictionHUD';
import SentenceTray from './SentenceTray';
import { ConfidenceSmoother } from '../../utils/smoothing';
import islModelService from '../../services/islModel';
import { Sparkles, Eye, Hash, Type, Globe } from 'lucide-react';

export default function SignToTextMain() {
  const [isModelReady, setIsModelReady] = useState(false);
  const [modelError, setModelError] = useState(null);
  const [isHandPresent, setIsHandPresent] = useState(false);
  const [recognitionMode, setRecognitionMode] = useState('all'); // 'all', 'digits', 'letters'

  // Raw single-frame prediction from model
  const [rawPrediction, setRawPrediction] = useState(null);
  // Smoothed prediction over 10 frames
  const [smoothedPrediction, setSmoothedPrediction] = useState(null);

  // Smoother instance ref
  const smootherRef = useRef(new ConfidenceSmoother(10, 0.75, 6));

  // Load ISL model on mount
  useEffect(() => {
    let isMounted = true;
    async function loadModel() {
      try {
        const success = await islModelService.loadModel('/model');
        if (isMounted) {
          setIsModelReady(success);
          if (!success) {
            setModelError(islModelService.loadError || 'Failed to initialize ISL model');
          }
        }
      } catch (err) {
        if (isMounted) {
          setModelError(err.message);
        }
      }
    }
    loadModel();
    return () => {
      isMounted = false;
    };
  }, []);

  // Frame processing callback from WebcamCanvas
  const handleLandmarksDetected = useCallback((landmarks) => {
    if (!landmarks) {
      setIsHandPresent(false);
      setRawPrediction(null);
      const smoothed = smootherRef.current.addPrediction(null);
      setSmoothedPrediction(smoothed);
      return;
    }

    setIsHandPresent(true);

    if (islModelService.isLoaded) {
      const pred = islModelService.predict(landmarks, recognitionMode);
      setRawPrediction(pred);
      const smoothed = smootherRef.current.addPrediction(pred);
      setSmoothedPrediction(smoothed);
    }
  }, [recognitionMode]);

  // Determine dynamic tips for Mascot
  const getMascotTip = () => {
    if (!isHandPresent) {
      return {
        mascot: 'nudge',
        title: 'Ready for Signing',
        tip: recognitionMode === 'digits'
          ? 'Showing signs in Numbers Mode (0-9). Show 3 fingers for Digit 3, 2 fingers for Digit 2, etc.'
          : recognitionMode === 'letters'
          ? 'Showing signs in Alphabet Mode (A-Z). Show 3 fingers for Letter W, 2 fingers for V/U, etc.'
          : 'Showing signs in Auto Mode (36 Classes). Show Thumb+Index+Middle for 3, or Index+Middle+Ring for W.'
      };
    }
    if (smoothedPrediction?.isStable) {
      return {
        mascot: 'tally',
        title: `Recognized Sign '${smoothedPrediction.label}'`,
        tip: 'Sign verified across multiple frames! Hold steady to auto-append or continue signing.'
      };
    }
    if (smoothedPrediction?.voteCount > 0) {
      return {
        mascot: 'blip',
        title: 'Analyzing Gesture',
        tip: 'Keep fingers firm and clearly visible in the camera frame.'
      };
    }
    return {
      mascot: 'nudge',
      title: 'Hand Tracking Active',
      tip: 'Hold your hand inside the frame with clear lighting.'
    };
  };

  const currentTip = getMascotTip();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner / Mode Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-900/60 border border-indigo-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              Part 1 • Real-time AI
            </span>
            <span className="text-xs text-slate-400 font-medium">Dataset-Trained ISL Classifier</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Sign → Text Fingerspelling Recognition
          </h1>
        </div>

        {/* Live AI Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          On-Device AI Active
        </div>
      </div>

      {/* Target Recognition Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Recognition Scope:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRecognitionMode('all');
              smootherRef.current.reset();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              recognitionMode === 'all'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Auto (All 36 Classes)</span>
          </button>

          <button
            onClick={() => {
              setRecognitionMode('digits');
              smootherRef.current.reset();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              recognitionMode === 'digits'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Numbers Mode (0-9)</span>
          </button>

          <button
            onClick={() => {
              setRecognitionMode('letters');
              smootherRef.current.reset();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              recognitionMode === 'letters'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Alphabet Mode (A-Z)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Camera & Skeleton Visualizer + Live Prediction HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Webcam + MediaPipe Skeleton */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <WebcamCanvas
            onLandmarksDetected={handleLandmarksDetected}
            isModelReady={isModelReady}
          />
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-1 bg-emerald-500 rounded-full" />
              <span>Green: Skeletal Connections</span>
              <span className="inline-block w-2 h-2 bg-rose-500 rounded-full ml-2" />
              <span>Red: Hand Landmarks (21 points)</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              Active: {recognitionMode === 'digits' ? 'Digits (0-9)' : recognitionMode === 'letters' ? 'Alphabet (A-Z)' : 'All 36 ISL'}
            </span>
          </div>
        </div>

        {/* Right Column: Prediction HUD & Top Candidates */}
        <div className="lg:col-span-5 flex flex-col">
          <PredictionHUD
            prediction={smoothedPrediction}
            rawPrediction={rawPrediction}
            isHandPresent={isHandPresent}
          />
        </div>
      </div>

      {/* Bottom Section: Real-time Sentence Builder Tray */}
      <div className="w-full">
        <SentenceTray
          currentLetter={smoothedPrediction?.label || null}
          isStable={smoothedPrediction?.isStable || false}
        />
      </div>
    </div>
  );
}

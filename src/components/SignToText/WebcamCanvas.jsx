import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff, RefreshCw, AlertTriangle, CheckCircle, ShieldAlert, Hand } from 'lucide-react';

export default function WebcamCanvas({ onLandmarksDetected, isModelReady }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraInstanceRef = useRef(null);
  const handsInstanceRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [permissionError, setPermissionError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [handPresent, setHandPresent] = useState(false);
  const [fps, setFps] = useState(0);

  // FPS tracker
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(Date.now());

  // Callback to handle MediaPipe results
  const onResults = useCallback((results) => {
    // Update FPS
    frameCountRef.current += 1;
    const now = Date.now();
    if (now - lastFpsUpdateRef.current >= 1000) {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
      lastFpsUpdateRef.current = now;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match canvas dimensions to video
    if (results.image) {
      if (canvas.width !== results.image.width || canvas.height !== results.image.height) {
        canvas.width = results.image.width || 640;
        canvas.height = results.image.height || 480;
      }
    }

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mirror image horizontally for intuitive user interaction
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    // Draw webcam frame
    if (results.image) {
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    }

    // Check if hands were detected
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandPresent(true);
      const landmarks = results.multiHandLandmarks[0];

      // Draw custom glowing ISL skeletal lines
      if (window.drawConnectors && window.HAND_CONNECTIONS) {
        window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
          color: '#10B981',
          lineWidth: 4
        });
      }

      // Draw red joint nodes
      if (window.drawLandmarks) {
        window.drawLandmarks(ctx, landmarks, {
          color: '#EF4444',
          fillColor: '#FCA5A5',
          lineWidth: 2,
          radius: 5
        });
      }

      // Pass landmarks to parent predictor
      if (onLandmarksDetected) {
        onLandmarksDetected(landmarks);
      }
    } else {
      setHandPresent(false);
      if (onLandmarksDetected) {
        onLandmarksDetected(null);
      }
    }

    ctx.restore();
  }, [onLandmarksDetected]);

  // Initialize MediaPipe Hands and Camera
  useEffect(() => {
    let isMounted = true;

    async function initMediaPipe() {
      setIsInitializing(true);
      setPermissionError(null);

      try {
        if (!window.Hands || !window.Camera) {
          let retries = 0;
          while ((!window.Hands || !window.Camera) && retries < 30) {
            await new Promise(r => setTimeout(r, 150));
            retries++;
          }
        }

        if (!window.Hands || !window.Camera) {
          throw new Error('MediaPipe Hands libraries could not be loaded from CDN. Please check your internet connection.');
        }

        if (!videoRef.current) return;

        const hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.45,
          minTrackingConfidence: 0.45
        });

        hands.onResults(onResults);
        handsInstanceRef.current = hands;

        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && handsInstanceRef.current) {
              await handsInstanceRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });

        await camera.start();
        cameraInstanceRef.current = camera;

        if (isMounted) {
          setCameraActive(true);
          setIsInitializing(false);
        }
      } catch (err) {
        console.error('Camera/MediaPipe initialization error:', err);
        if (isMounted) {
          setIsInitializing(false);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setPermissionError('Camera permission was denied. Please allow camera access in your browser settings.');
          } else {
            setPermissionError(err.message || 'Failed to initialize camera.');
          }
        }
      }
    }

    initMediaPipe();

    return () => {
      isMounted = false;
      if (cameraInstanceRef.current) {
        try {
          cameraInstanceRef.current.stop();
        } catch (e) {}
      }
      if (handsInstanceRef.current) {
        try {
          handsInstanceRef.current.close();
        } catch (e) {}
      }
    };
  }, [onResults]);

  const restartCamera = () => {
    window.location.reload();
  };

  return (
    <div className="relative w-full aspect-[4/3] max-h-[460px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
      {/* Hidden Video for MediaPipe Stream Input */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="hidden"
      />

      {/* Visible Canvas with Mirrored Video & Skeleton Overlay */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover rounded-3xl"
      />

      {/* Overlay Status Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        {/* Detection Status Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-xs font-semibold shadow-lg">
          <span className={`w-2.5 h-2.5 rounded-full ${handPresent ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400'}`} />
          <span className="text-slate-200">
            {handPresent ? 'Hand Tracking Active' : 'Waiting for Hand...'}
          </span>
        </div>

        {/* FPS & Model State */}
        <div className="flex items-center gap-2">
          {fps > 0 && (
            <div className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300 shadow-sm">
              {fps} FPS
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-800 text-[11px] font-semibold text-slate-300 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${isModelReady ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-amber-400 animate-ping'}`} />
            {isModelReady ? 'ISL Model Ready' : 'Loading Model...'}
          </div>
        </div>
      </div>

      {/* Hand Silhouette Guide (when no hand detected) */}
      {!handPresent && cameraActive && !permissionError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
          <div className="w-40 h-52 border-2 border-dashed border-indigo-400/50 rounded-3xl flex items-center justify-center mb-2">
            <span className="text-xs font-medium text-indigo-200 text-center px-4">
              Place hand clearly inside frame
            </span>
          </div>
        </div>
      )}

      {/* Ishaara-Style Laser Scanner Loading Overlay */}
      {isInitializing && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
          <div className="relative flex items-center justify-center w-28 h-28 mb-6">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-2 border-4 border-transparent border-b-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2.5s' }} />
            
            {/* Hand Icon with Laser Sweep */}
            <div className="relative w-12 h-12 text-indigo-400 flex items-center justify-center overflow-hidden">
              <Hand className="w-10 h-10 -rotate-12" />
              <div className="absolute left-0 w-full h-[2px] bg-indigo-400 shadow-[0_0_8px_2px_rgba(99,102,241,0.9)] animate-pulse" />
            </div>
          </div>

          <h3 className="text-lg font-black text-white mb-1 tracking-tight">Starting AI Camera Engine</h3>
          <p className="text-xs text-slate-400 max-w-xs">Initializing MediaPipe HandLandmarker & WebGL Neural Acceleration...</p>
        </div>
      )}

      {/* Permission Error State */}
      {permissionError && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-rose-200 mb-1.5">Camera Access Needed</h3>
          <p className="text-xs text-slate-300 max-w-sm mb-4 leading-relaxed">{permissionError}</p>
          <button
            onClick={restartCamera}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Camera Access
          </button>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Target, MessageSquare, Hand, BookOpen } from 'lucide-react';

export default function HeroSection({ onStartTranslating, onExploreDictionary, onOpenPractice }) {
  return (
    <div className="w-full relative overflow-hidden">
      {/* Background ambient glow gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 px-4 max-w-7xl mx-auto text-center">
        {/* On-Device Privacy Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-xs font-semibold text-slate-200">100% Local AI Processing</span>
          <span className="text-slate-500 text-xs hidden sm:inline">•</span>
          <span className="text-xs text-slate-400 hidden sm:inline">Zero Video Data Leaves Your Device</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
          Convert <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Indian Sign Language</span> To Text In Real Time With <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">SignSync</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Trained on <span className="text-indigo-300 font-bold">real ISL dataset images</span> with high-performance on-device TensorFlow.js & MediaPipe, delivering instant bidirectional accessibility with <span className="text-purple-300 font-bold">96.3% accuracy</span>.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={onStartTranslating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold text-sm shadow-xl shadow-indigo-950/60 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Start Translating Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreDictionary}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-800 hover:border-slate-700 transition-all hover:scale-[1.02]"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Sign Dictionary</span>
          </button>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="w-full py-12 border-y border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Deaf Community in India</div>
              <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-mono-code">1.8 Crore+</p>
              <p className="text-xs text-slate-500 mt-1">18+ Million People</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Supported ISL Signs</div>
              <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-mono-code">36 Classes</p>
              <p className="text-xs text-slate-500 mt-1">Full 0-9 Digits & A-Z Alphabet + Phrases</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Inference Latency</div>
              <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-mono-code">&lt; 30 ms</p>
              <p className="text-xs text-slate-500 mt-1">Real-Time Client WebGL Inference</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SignSync Bento Grid */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Why Choose <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">SignSync?</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base mt-3">
            Next-generation accessibility features built for seamless, private, and instant communication.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
          {/* Card 1: Real-time Translation (Span 2x2) */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/50 transition-all shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Real-time Translation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Convert Indian Sign Language gestures to text and speech instantly with minimal latency using on-device neural acceleration.
              </p>
            </div>
          </div>

          {/* Card 2: High Precision */}
          <div className="md:col-span-1 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between group hover:border-purple-500/50 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">High Precision</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Trained on real Kaggle ISL datasets with 96.3% validation accuracy.
              </p>
            </div>
          </div>

          {/* Card 3: 100% Private */}
          <div className="md:col-span-1 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between group hover:border-emerald-500/50 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">100% Private</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Zero camera frames leave your device. All inference executes locally.
              </p>
            </div>
          </div>

          {/* Card 4: Bidirectional Text-to-Sign */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between group hover:border-pink-500/50 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Bidirectional Synthesis</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Both Sign → Text AI recognition and Text → Sign sequential video playback with speed controls.
              </p>
            </div>
          </div>

          {/* Card 5: Interactive Quiz & Dictionary */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between group hover:border-amber-500/50 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Dictionary & Practice Quiz</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Complete ISL knowledge base with anatomical hand guides, streak scoring, and AI camera evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

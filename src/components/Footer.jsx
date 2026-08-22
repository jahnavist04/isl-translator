import React, { useState } from 'react';
import { Hand, Heart, Globe, ShieldCheck, Mail, ArrowRight, Github } from 'lucide-react';

export default function Footer({ onSelectMode }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative overflow-hidden pt-16 pb-12 border-t border-slate-800/80 bg-slate-950 text-slate-100 font-sans mt-20">
      {/* Massive Brand Watermark */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none -z-0 overflow-hidden leading-none opacity-5">
        <span className="text-[6rem] sm:text-[10rem] md:text-[14rem] font-black tracking-tighter uppercase block whitespace-nowrap text-indigo-400">
          SIGNSYNC
        </span>
      </div>

      <div className="container mx-auto px-6 sm:px-8 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14">
          {/* Brand Intro (5 cols) */}
          <div className="lg:col-span-5 space-y-4 pr-0 lg:pr-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                <Hand className="w-4 h-4 text-white -rotate-12" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">SignSync</span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Breaking communication barriers with advanced, privacy-first Indian Sign Language AI. Processing happens 100% on your device, making the world accessible, securely.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% On-Device AI</span>
              </div>
              <span className="text-xs text-slate-500">Zero server round-trips</span>
            </div>
          </div>

          {/* Product Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-sm tracking-tight">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => onSelectMode('sign-to-text')} className="hover:text-indigo-300 transition-colors">
                  Live Camera Translator (Sign → Text)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectMode('text-to-sign')} className="hover:text-indigo-300 transition-colors">
                  Text to Sign Visualizer (Text → Sign)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectMode('dictionary')} className="hover:text-indigo-300 transition-colors">
                  36 ISL Sign Dictionary & Anatomy
                </button>
              </li>
              <li>
                <button onClick={() => onSelectMode('practice')} className="hover:text-indigo-300 transition-colors">
                  Interactive Practice Quiz
                </button>
              </li>
            </ul>
          </div>

          {/* Stay Updated (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-bold text-white text-sm tracking-tight">Stay Updated</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe for release notes, model updates, and accessibility features.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="flex-1 h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-emerald-400 font-medium">Subscribed successfully!</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Legal & Credits */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>© 2026 SignSync AI. Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Indian Sign Language Accessibility.</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Private & Free for Everyone</span>
            <span>•</span>
            <span>TensorFlow.js + MediaPipe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

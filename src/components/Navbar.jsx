import React from 'react';
import { Camera, Type, BookOpen, Award, Hand, Home, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar({ currentMode, onSelectMode }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'sign-to-text', label: 'Translate', icon: Camera, badge: 'Live AI' },
    { id: 'text-to-sign', label: 'Text to Sign', icon: Type },
    { id: 'dictionary', label: 'Sign Models', icon: BookOpen },
    { id: 'practice', label: 'Practice Quiz', icon: Award }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <button
            onClick={() => onSelectMode('home')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-950/50 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Hand className="w-5 h-5 text-indigo-400 -rotate-12 group-hover:rotate-0 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black font-poppins tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-white">
                SignSync
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                Indian Sign Language AI
              </span>
            </div>
          </button>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectMode(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-950/50 scale-[1.02]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Local AI Badge & Mascots */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span>Local On-Device AI</span>
            </div>

            {/* Mobile Nav Trigger Button */}
            <div className="flex md:hidden items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentMode === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectMode(item.id)}
                    title={item.label}
                    className={`p-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

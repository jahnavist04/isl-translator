import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/Home/HeroSection';
import SignToTextMain from './components/SignToText/SignToTextMain';
import TextToSignTranslator from './components/TextToSign/TextToSignTranslator';
import SignDictionary from './components/TextToSign/SignDictionary';
import PracticeQuiz from './components/Practice/PracticeQuiz';
import Footer from './components/Footer';

export default function App() {
  const [activeMode, setActiveMode] = useState('home');
  const [practiceSign, setPracticeSign] = useState(null);

  const handleSelectSignForPractice = (signCode) => {
    setPracticeSign(signCode);
    setActiveMode('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (mode) => {
    setActiveMode(mode);
    if (mode !== 'practice') setPracticeSign(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      {/* Top Navbar */}
      <Navbar
        currentMode={activeMode}
        onSelectMode={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeMode === 'home' && (
          <HeroSection
            onStartTranslating={() => handleNavigate('sign-to-text')}
            onExploreDictionary={() => handleNavigate('dictionary')}
            onOpenPractice={() => handleNavigate('practice')}
          />
        )}
        {activeMode === 'sign-to-text' && <SignToTextMain />}
        {activeMode === 'text-to-sign' && <TextToSignTranslator />}
        {activeMode === 'dictionary' && (
          <SignDictionary onSelectSignForPractice={handleSelectSignForPractice} />
        )}
        {activeMode === 'practice' && <PracticeQuiz initialSignCode={practiceSign} />}
      </main>

      {/* Ishaara-Style Rich Footer */}
      <Footer onSelectMode={handleNavigate} />
    </div>
  );
}

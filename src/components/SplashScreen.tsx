'use client';

import { useState, useEffect } from 'react';
import AnimatedLogo from './AnimatedLogo';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [fading, setFading] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // Wait for the full 5-step animation (approx 2.5s) plus some reading time
    const timer1 = setTimeout(() => setFading(true), 3500);
    // Fully remove from DOM after fade transition
    const timer2 = setTimeout(() => {
      setRemoved(true);
      onComplete();
    }, 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (removed) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0F1117] transition-opacity duration-700 ease-in-out ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex flex-col items-center gap-8">
        <AnimatedLogo className="w-56 h-56" animated={true} />
        
        <div className="flex flex-col items-center gap-2 mt-4 relative">
          <style>{`
            .fade-up-text {
              opacity: 0;
              transform: translateY(10px);
              animation: fade-up 1s ease-out forwards;
            }
            @keyframes fade-up {
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          
          <h1 className="text-4xl font-bold tracking-tight text-white fade-up-text" style={{ animationDelay: '2.2s' }}>
            <span className="text-[#4F8CFF]">AI</span> INTERVIEWER
          </h1>
          <span className="text-xs text-[#9CA3AF] uppercase tracking-[0.4em] font-semibold fade-up-text" style={{ animationDelay: '2.6s' }}>
            Practice. Improve. Succeed.
          </span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import AnimatedLogo from './AnimatedLogo';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [fading, setFading] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFading(true), 3500);
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
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#161514] transition-opacity duration-700 ease-in-out ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex flex-col items-center gap-8">
        <AnimatedLogo className="w-48 h-48" animated={true} />
        
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
          
          <h1 className="text-3xl font-normal tracking-tight text-[#F0EBE3] fade-up-text" style={{ animationDelay: '2.2s', fontFamily: 'var(--font-display)' }}>
            <span className="text-[#D4943A]">AI</span> Interviewer
          </h1>
          <span className="text-[11px] text-[#7A7268] uppercase tracking-[0.3em] font-medium fade-up-text" style={{ animationDelay: '2.6s' }}>
            Practice. Improve. Succeed.
          </span>
        </div>
      </div>
    </div>
  );
}

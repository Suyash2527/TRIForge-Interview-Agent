'use client';

import { useState, useEffect } from 'react';
import AnimatedLogo from './AnimatedLogo';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 400);
    const t2 = setTimeout(() => setPhase('exit'), 3200);
    const t3 = setTimeout(() => {
      setRemoved(true);
      onComplete();
    }, 3900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  if (removed) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)] transition-opacity duration-700 ease-in-out ${
        phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Radial glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,109,250,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="flex flex-col items-center gap-10 relative">
        <AnimatedLogo className="w-40 h-40" animated={true} />

        <div className="flex flex-col items-center gap-2">
          <style>{`
            .splash-title {
              opacity: 0;
              transform: translateY(12px);
              animation: splash-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              animation-delay: 2.0s;
            }
            .splash-sub {
              opacity: 0;
              transform: translateY(8px);
              animation: splash-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              animation-delay: 2.4s;
            }
            .splash-rule {
              opacity: 0;
              animation: splash-fade 0.6s ease-out forwards;
              animation-delay: 2.2s;
            }
            @keyframes splash-up {
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes splash-fade {
              to { opacity: 1; }
            }
          `}</style>

          <h1
            className="splash-title text-2xl font-semibold tracking-tight text-[var(--text)]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            TRI<span style={{ color: 'var(--accent)' }}>Forge</span>
          </h1>

          <div className="splash-rule divider-gradient w-32 my-1" />

          <span
            className="splash-sub text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.35em] font-medium"
          >
            Interview Agent
          </span>
        </div>
      </div>
    </div>
  );
}

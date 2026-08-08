'use client';

export default function AnimatedLogo({
  className = "w-32 h-32",
  animated = true,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      {animated && (
        <style>{`
          .svg-logo path, .svg-logo rect, .svg-logo circle, .svg-logo polygon {
            fill: transparent;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 500;
            stroke-dashoffset: 500;
            animation: draw-path 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            will-change: stroke-dashoffset;
          }
          .svg-logo .d1  { animation-delay: 0.0s; }
          .svg-logo .d2  { animation-delay: 0.5s; }
          .svg-logo .d3  { animation-delay: 0.9s; }
          .svg-logo .d4  { animation-delay: 1.3s; }
          .svg-logo .eyes {
            fill: transparent;
            stroke: none;
            animation: eye-glow 0.4s ease-out forwards;
            animation-delay: 1.9s;
          }
          .svg-logo .glow-ring {
            fill: transparent;
            stroke: rgba(124, 109, 250, 0.15);
            stroke-width: 1;
            animation: ring-expand 1.2s ease-out forwards;
            animation-delay: 2.0s;
            transform-origin: 50px 50px;
          }

          @keyframes draw-path {
            to { stroke-dashoffset: 0; }
          }
          @keyframes eye-glow {
            to { fill: #7c6dfa; }
          }
          @keyframes ring-expand {
            from { r: 0; opacity: 0.8; }
            to   { r: 48; opacity: 0; }
          }
        `}</style>
      )}

      <svg viewBox="0 0 100 100" className={`w-full h-full ${animated ? 'svg-logo' : 'svg-static'}`}>
        <defs>
          <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9589fb" />
            <stop offset="100%" stopColor="#7c6dfa" />
          </linearGradient>
          <linearGradient id="slateGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8eaf0" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Expanding glow ring (animated only) */}
        {animated && <circle className="glow-ring" cx="50" cy="50" r="0" />}

        {/* Chat bubble — left */}
        <path
          className={animated ? 'd1' : ''}
          d="M 15 40 C 15 22 25 14 50 14 C 50 14 50 14 50 14"
          stroke={animated ? '#6b7280' : 'url(#slateGrad)'}
          fill="none"
        />
        <path
          className={animated ? 'd1' : ''}
          d="M 50 14 C 75 14 85 22 85 40 C 85 58 75 66 50 66"
          stroke={animated ? '#7c6dfa' : 'url(#violetGrad)'}
          fill="none"
        />
        <path
          className={animated ? 'd2' : ''}
          d="M 50 66 C 25 66 15 58 15 40"
          stroke={animated ? '#6b7280' : 'url(#slateGrad)'}
          fill="none"
        />
        {/* Tail */}
        <path
          className={animated ? 'd2' : ''}
          d="M 35 66 L 28 80 L 46 70"
          stroke={animated ? '#7c6dfa' : 'url(#violetGrad)'}
          fill="none"
          strokeLinejoin="round"
        />

        {/* Headset band */}
        <path
          className={animated ? 'd3' : ''}
          d="M 22 48 C 22 18 78 18 78 48"
          stroke={animated ? '#e8eaf0' : 'url(#slateGrad)'}
          fill="none"
        />

        {/* Earcups */}
        <rect
          className={animated ? 'd3' : ''}
          x="15" y="40" width="9" height="18" rx="4.5"
          stroke={animated ? '#7c6dfa' : 'url(#violetGrad)'}
          fill={animated ? 'transparent' : 'url(#violetGrad)'}
        />
        <rect
          className={animated ? 'd3' : ''}
          x="76" y="40" width="9" height="18" rx="4.5"
          stroke={animated ? '#7c6dfa' : 'url(#violetGrad)'}
          fill={animated ? 'transparent' : 'url(#violetGrad)'}
        />

        {/* Mic arm */}
        <path
          className={animated ? 'd4' : ''}
          d="M 79 54 Q 79 68 68 70"
          stroke={animated ? '#e8eaf0' : 'url(#slateGrad)'}
          fill="none"
        />
        <circle
          className={animated ? 'd4' : ''}
          cx="64" cy="70" r="3.5"
          stroke={animated ? '#7c6dfa' : 'url(#violetGrad)'}
          fill={animated ? 'transparent' : '#7c6dfa'}
        />

        {/* Eyes */}
        <rect
          className={animated ? 'eyes' : ''}
          x="38" y="34" width="7" height="11" rx="3.5"
          fill={animated ? 'transparent' : '#7c6dfa'}
          filter={!animated ? 'url(#glow)' : undefined}
        />
        <rect
          className={animated ? 'eyes' : ''}
          x="55" y="34" width="7" height="11" rx="3.5"
          fill={animated ? 'transparent' : '#7c6dfa'}
          filter={!animated ? 'url(#glow)' : undefined}
        />
      </svg>
    </div>
  );
}

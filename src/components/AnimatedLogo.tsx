'use client';

export default function AnimatedLogo({ className = "w-32 h-32", animated = true }: { className?: string, animated?: boolean }) {
  return (
    <div className={`relative ${className}`}>
      {animated && (
        <style>{`
          .svg-logo path, .svg-logo rect, .svg-logo circle {
            fill: transparent;
            stroke-width: 4;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 400;
            stroke-dashoffset: 400;
            animation: draw 1s ease-in-out forwards;
            will-change: stroke-dashoffset, fill, opacity;
            transform: translateZ(0);
          }
          .svg-logo .delay-1 { animation-delay: 0.8s; }
          .svg-logo .delay-2 { animation-delay: 1.4s; }
          .svg-logo .eyes {
            fill: transparent;
            stroke: none;
            animation: glow 0.5s ease-in forwards;
            animation-delay: 2s;
            will-change: fill;
          }
          .svg-logo .final-fill {
            animation: fill-color 1s ease-in forwards;
            animation-delay: 2.5s;
          }
          
          @keyframes draw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes glow {
            to { fill: #4F8CFF; } /* Removed expensive drop-shadow filter */
          }
          @keyframes fill-color {
            to { fill-opacity: 1; stroke-opacity: 0.1; }
          }
          
          /* Static styles for header */
          .svg-static path, .svg-static rect, .svg-static circle {
            stroke-width: 6;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
        `}</style>
      )}

      <svg 
        viewBox="0 0 100 100" 
        className={`w-full h-full ${animated ? 'svg-logo' : 'svg-static'}`}
      >
        <defs>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F8CFF" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="silverGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F3F4F6" />
            <stop offset="100%" stopColor="#9CA3AF" />
          </linearGradient>
        </defs>

        {/* Bubble Left (Silver) */}
        <path 
          d="M 50 15 C 20 15 10 25 10 45 C 10 65 20 75 40 75 L 40 90 L 50 80" 
          stroke={animated ? "#9CA3AF" : "url(#silverGrad)"} 
          className={animated ? "final-fill" : ""} 
          style={!animated ? { fill: "transparent", strokeWidth: 6 } : {}}
        />

        {/* Bubble Right (Blue) */}
        <path 
          d="M 50 15 C 80 15 90 25 90 45 C 90 65 80 75 50 75" 
          stroke={animated ? "#4F8CFF" : "url(#blueGrad)"} 
          className={animated ? "final-fill" : ""}
          style={!animated ? { fill: "transparent", strokeWidth: 6 } : {}}
        />

        {/* Robot Head */}
        <rect 
          x="30" y="30" width="40" height="35" rx="12" 
          stroke="#4B5563" 
          fill={animated ? "transparent" : "#1F2937"} 
          className={animated ? "delay-1 final-fill" : ""} 
          style={!animated ? { fill: "#1F2937", strokeWidth: 0 } : {}}
        />

        {/* Headset Band */}
        <path 
          d="M 24 50 C 24 20 76 20 76 50" 
          stroke={animated ? "#E5E7EB" : "url(#silverGrad)"} 
          fill="none" 
          className={animated ? "delay-2" : ""}
          style={!animated ? { strokeWidth: 5 } : {}}
        />

        {/* Earcups */}
        <rect x="18" y="40" width="8" height="20" rx="4" stroke="#4F8CFF" fill={animated ? "transparent" : "url(#blueGrad)"} className={animated ? "delay-2 final-fill" : ""} style={!animated ? { strokeWidth: 0 } : {}} />
        <rect x="74" y="40" width="8" height="20" rx="4" stroke="#4F8CFF" fill={animated ? "transparent" : "url(#blueGrad)"} className={animated ? "delay-2 final-fill" : ""} style={!animated ? { strokeWidth: 0 } : {}} />

        {/* Microphone */}
        <path 
          d="M 76 55 C 76 70 65 72 58 72" 
          stroke={animated ? "#E5E7EB" : "url(#silverGrad)"} 
          fill="none" 
          className={animated ? "delay-2" : ""}
        />
        <circle cx="55" cy="72" r="4" stroke="#4B5563" fill={animated ? "transparent" : "#4B5563"} className={animated ? "delay-2 final-fill" : ""} style={!animated ? { strokeWidth: 0 } : {}} />

        {/* Eyes */}
        <rect 
          x="40" y="42" width="6" height="12" rx="3" 
          fill={animated ? "transparent" : "#4F8CFF"} 
          className={animated ? "eyes" : ""} 
        />
        <rect 
          x="54" y="42" width="6" height="12" rx="3" 
          fill={animated ? "transparent" : "#4F8CFF"} 
          className={animated ? "eyes" : ""} 
        />
      </svg>
    </div>
  );
}

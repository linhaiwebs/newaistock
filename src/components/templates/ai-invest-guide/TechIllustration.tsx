export function TechIllustration() {
  return (
    <div className="w-full h-48 overflow-hidden relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <svg
        viewBox="0 0 375 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect width="375" height="200" fill="url(#glowGradient)" opacity="0.3"/>

        <g className="animate-pulse">
          <circle cx="60" cy="60" r="25" fill="rgba(255, 255, 255, 0.1)" />
          <circle cx="60" cy="60" r="18" fill="url(#chipGradient)" opacity="0.9" />
          <rect x="52" y="52" width="16" height="16" fill="white" opacity="0.3" rx="2" />
          <line x1="60" y1="45" x2="60" y2="55" stroke="white" strokeWidth="1" opacity="0.6" />
          <line x1="60" y1="65" x2="60" y2="75" stroke="white" strokeWidth="1" opacity="0.6" />
          <line x1="45" y1="60" x2="55" y2="60" stroke="white" strokeWidth="1" opacity="0.6" />
          <line x1="65" y1="60" x2="75" y2="60" stroke="white" strokeWidth="1" opacity="0.6" />
        </g>

        <g className="animate-[float_3s_ease-in-out_infinite]">
          <path
            d="M 100 80 Q 130 60, 160 80 T 220 80"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="10"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
          <circle cx="100" cy="80" r="3" fill="white" opacity="0.8">
            <animate
              attributeName="cx"
              from="100"
              to="220"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        <g transform="translate(240, 40)">
          <rect x="0" y="30" width="6" height="15" fill="rgba(255, 255, 255, 0.7)" rx="1" />
          <rect x="10" y="20" width="6" height="25" fill="rgba(255, 255, 255, 0.8)" rx="1" />
          <rect x="20" y="25" width="6" height="20" fill="rgba(255, 255, 255, 0.6)" rx="1" />
          <rect x="30" y="15" width="6" height="30" fill="rgba(255, 255, 255, 0.9)" rx="1" />
          <rect x="40" y="10" width="6" height="35" fill="rgba(255, 255, 255, 0.8)" rx="1" />
        </g>

        <g transform="translate(280, 80)">
          <polyline
            points="0,30 10,25 20,28 30,15 40,18 50,10"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            filter="url(#glow)"
          />
          <circle cx="50" cy="10" r="4" fill="white" opacity="0.9" />
          <polygon points="50,10 55,5 60,10 55,8" fill="white" opacity="0.9" />
        </g>

        <g className="animate-[spin_20s_linear_infinite]" transform="translate(320, 140)">
          <circle cx="0" cy="0" r="20" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />
          <circle cx="0" cy="0" r="15" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="10" fill="rgba(255, 255, 255, 0.4)" />
          <rect x="-2" y="-5" width="4" height="10" fill="white" opacity="0.6" rx="1" />
        </g>

        <g transform="translate(40, 140)">
          <rect x="0" y="0" width="50" height="35" rx="4" fill="rgba(255, 255, 255, 0.15)" />
          <rect x="5" y="5" width="40" height="20" rx="2" fill="rgba(255, 255, 255, 0.2)" />
          <line x1="10" y1="15" x2="40" y2="15" stroke="white" strokeWidth="1" opacity="0.5" />
          <line x1="10" y1="18" x2="35" y2="18" stroke="white" strokeWidth="1" opacity="0.4" />
        </g>

        <g className="animate-pulse" transform="translate(150, 140)">
          <circle cx="0" cy="0" r="12" fill="rgba(255, 255, 255, 0.2)" />
          <circle cx="0" cy="0" r="8" fill="rgba(255, 255, 255, 0.3)" />
          <circle cx="-3" cy="-2" r="3" fill="white" opacity="0.8" />
          <circle cx="3" cy="-2" r="3" fill="white" opacity="0.8" />
          <path d="M -4,3 Q 0,6 4,3" stroke="white" strokeWidth="1.5" fill="none" opacity="0.8" />
        </g>
      </svg>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

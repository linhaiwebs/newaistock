export function TechStockIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="techGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="techGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="1200" height="300" fill="#0f172a"/>

      <rect x="0" y="0" width="1200" height="300" fill="url(#techGradient1)" opacity="0.3"/>

      <g opacity="0.15">
        <line x1="100" y1="0" x2="100" y2="300" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 4"/>
        <line x1="300" y1="0" x2="300" y2="300" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4"/>
        <line x1="500" y1="0" x2="500" y2="300" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 4"/>
        <line x1="700" y1="0" x2="700" y2="300" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 4"/>
        <line x1="900" y1="0" x2="900" y2="300" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4"/>
        <line x1="1100" y1="0" x2="1100" y2="300" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 4"/>
      </g>

      <g className="ai-chip" transform="translate(150, 80)">
        <rect x="0" y="0" width="80" height="80" rx="8" fill="#1e293b" stroke="#06b6d4" strokeWidth="2"/>
        <circle cx="40" cy="40" r="25" fill="url(#techGradient2)" filter="url(#glow)"/>
        <path d="M30 40 L40 30 L50 40 L40 50 Z" fill="#06b6d4" opacity="0.8"/>
        <line x1="-10" y1="20" x2="0" y2="20" stroke="#06b6d4" strokeWidth="2"/>
        <line x1="-10" y1="40" x2="0" y2="40" stroke="#06b6d4" strokeWidth="2"/>
        <line x1="-10" y1="60" x2="0" y2="60" stroke="#06b6d4" strokeWidth="2"/>
        <line x1="80" y1="20" x2="90" y2="20" stroke="#06b6d4" strokeWidth="2"/>
        <line x1="80" y1="40" x2="90" y2="40" stroke="#06b6d4" strokeWidth="2"/>
        <line x1="80" y1="60" x2="90" y2="60" stroke="#06b6d4" strokeWidth="2"/>
      </g>

      <g className="data-stream-1" opacity="0.7">
        <path d="M 250 120 Q 350 120 400 150" stroke="url(#glowGradient)" strokeWidth="3" fill="none" filter="url(#glow)">
          <animate attributeName="stroke-dasharray" from="0 1000" to="1000 0" dur="2s" repeatCount="indefinite"/>
        </path>
        <circle cx="400" cy="150" r="4" fill="#06b6d4" filter="url(#glow)">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </g>

      <g className="candlestick-chart" transform="translate(420, 80)">
        <line x1="0" y1="0" x2="0" y2="180" stroke="#334155" strokeWidth="2"/>
        <line x1="0" y1="180" x2="200" y2="180" stroke="#334155" strokeWidth="2"/>

        <g className="candle-1">
          <line x1="30" y1="60" x2="30" y2="140" stroke="#22c55e" strokeWidth="1.5"/>
          <rect x="24" y="80" width="12" height="40" fill="#22c55e" opacity="0.8"/>
        </g>

        <g className="candle-2">
          <line x1="60" y1="40" x2="60" y2="120" stroke="#22c55e" strokeWidth="1.5"/>
          <rect x="54" y="50" width="12" height="50" fill="#22c55e" opacity="0.8"/>
        </g>

        <g className="candle-3">
          <line x1="90" y1="70" x2="90" y2="140" stroke="#ef4444" strokeWidth="1.5"/>
          <rect x="84" y="100" width="12" height="40" fill="#ef4444" opacity="0.8"/>
        </g>

        <g className="candle-4">
          <line x1="120" y1="50" x2="120" y2="110" stroke="#22c55e" strokeWidth="1.5"/>
          <rect x="114" y="60" width="12" height="30" fill="#22c55e" opacity="0.8"/>
        </g>

        <g className="candle-5">
          <line x1="150" y1="30" x2="150" y2="90" stroke="#22c55e" strokeWidth="1.5"/>
          <rect x="144" y="40" width="12" height="35" fill="#22c55e" opacity="0.8"/>
        </g>

        <polyline
          points="30,110 60,85 90,115 120,75 150,55"
          stroke="#06b6d4"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
          filter="url(#glow)"
        />
      </g>

      <g className="trend-arrow" transform="translate(680, 100)">
        <path
          d="M 0 100 L 50 80 L 100 50 L 150 20"
          stroke="#22c55e"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
        />
        <polygon points="150,20 140,15 145,28" fill="#22c55e"/>
        <circle cx="0" cy="100" r="5" fill="#22c55e" opacity="0.6"/>
        <circle cx="50" cy="80" r="5" fill="#22c55e" opacity="0.6"/>
        <circle cx="100" cy="50" r="5" fill="#22c55e" opacity="0.6"/>
        <circle cx="150" cy="20" r="5" fill="#22c55e"/>
      </g>

      <g className="dashboard-panel" transform="translate(880, 60)">
        <rect x="0" y="0" width="140" height="100" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" opacity="0.8"/>

        <rect x="10" y="15" width="120" height="4" rx="2" fill="#334155"/>
        <rect x="10" y="15" width="90" height="4" rx="2" fill="url(#techGradient2)">
          <animate attributeName="width" values="60;120;60" dur="3s" repeatCount="indefinite"/>
        </rect>

        <rect x="10" y="30" width="120" height="4" rx="2" fill="#334155"/>
        <rect x="10" y="30" width="75" height="4" rx="2" fill="url(#techGradient2)">
          <animate attributeName="width" values="40;100;40" dur="2.5s" repeatCount="indefinite"/>
        </rect>

        <rect x="10" y="45" width="120" height="4" rx="2" fill="#334155"/>
        <rect x="10" y="45" width="105" height="4" rx="2" fill="url(#techGradient2)">
          <animate attributeName="width" values="70;120;70" dur="3.5s" repeatCount="indefinite"/>
        </rect>

        <g transform="translate(10, 60)">
          <circle cx="8" cy="8" r="6" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.8"/>
          <circle cx="28" cy="8" r="6" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.8"/>
          <circle cx="48" cy="8" r="6" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0.8"/>
        </g>

        <text x="70" y="75" fill="#06b6d4" fontSize="24" fontWeight="bold" opacity="0.9">
          AI
        </text>
      </g>

      <g className="robot-assistant" transform="translate(1050, 150)">
        <ellipse cx="25" cy="70" rx="30" ry="15" fill="#06b6d4" opacity="0.2"/>

        <rect x="10" y="30" width="30" height="35" rx="5" fill="#1e293b" stroke="#06b6d4" strokeWidth="2"/>

        <circle cx="15" cy="10" r="8" fill="#1e293b" stroke="#06b6d4" strokeWidth="2"/>
        <circle cx="35" cy="10" r="8" fill="#1e293b" stroke="#06b6d4" strokeWidth="2"/>
        <line x1="15" y1="18" x2="15" y2="30" stroke="#06b6d4" strokeWidth="2"/>
        <line x1="35" y1="18" x2="35" y2="30" stroke="#06b6d4" strokeWidth="2"/>

        <circle cx="18" cy="40" r="2" fill="#06b6d4"/>
        <circle cx="32" cy="40" r="2" fill="#06b6d4"/>

        <path d="M 18 50 Q 25 54 32 50" stroke="#06b6d4" strokeWidth="2" fill="none"/>

        <line x1="10" y1="65" x2="5" y2="75" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round"/>
        <line x1="40" y1="65" x2="45" y2="75" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round"/>

        <circle cx="15" cy="8" r="1.5" fill="#06b6d4">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="35" cy="8" r="1.5" fill="#06b6d4">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>

      <g className="floating-particles" opacity="0.4">
        <circle cx="350" cy="50" r="2" fill="#06b6d4">
          <animate attributeName="cy" values="50;30;50" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="550" cy="250" r="3" fill="#3b82f6">
          <animate attributeName="cy" values="250;270;250" dur="4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="750" cy="80" r="2" fill="#8b5cf6">
          <animate attributeName="cy" values="80;60;80" dur="3.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="950" cy="220" r="2" fill="#06b6d4">
          <animate attributeName="cy" values="220;240;220" dur="4.5s" repeatCount="indefinite"/>
        </circle>
      </g>

      <rect x="0" y="280" width="1200" height="20" fill="url(#techGradient1)" opacity="0.4"/>
    </svg>
  );
}

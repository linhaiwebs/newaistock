export function AILogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#cyanGradient)"
          strokeWidth="2"
          opacity="0.3"
          className="animate-pulse"
          style={{ animationDuration: '2s' }}
        />

        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="url(#cyanGradient)"
          strokeWidth="3"
          opacity="0.6"
        />

        <circle
          cx="50"
          cy="50"
          r="15"
          fill="url(#cyanGradient)"
          className="animate-pulse"
          style={{ animationDuration: '1.5s' }}
        />

        <circle
          cx="50"
          cy="50"
          r="8"
          fill="#1f2937"
        />
      </svg>
    </div>
  );
}

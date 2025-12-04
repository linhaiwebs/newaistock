type Theme = 'cyan' | 'blue' | 'rose' | 'emerald';

interface AILogoProps {
  className?: string;
  theme?: Theme;
}

const themeColors: Record<Theme, { start: string; end: string }> = {
  cyan: { start: '#22d3ee', end: '#06b6d4' },
  blue: { start: '#60a5fa', end: '#3b82f6' },
  rose: { start: '#fb7185', end: '#f43f5e' },
  emerald: { start: '#34d399', end: '#10b981' },
};

export function AILogo({ className = "w-12 h-12", theme = 'cyan' }: AILogoProps) {
  const colors = themeColors[theme];
  const gradientId = `${theme}Gradient`;

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.start, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.end, stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={`url(#${gradientId})`}
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
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          opacity="0.6"
        />

        <circle
          cx="50"
          cy="50"
          r="15"
          fill={`url(#${gradientId})`}
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

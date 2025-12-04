interface GradientBackgroundProps {
  variant?: 'default' | 'minimal' | 'modern' | 'professional';
  className?: string;
}

export function GradientBackground({ variant = 'default', className = '' }: GradientBackgroundProps) {
  const backgrounds = {
    default: 'fintech-gradient',
    minimal: 'fintech-gradient',
    modern: 'fintech-gradient',
    professional: 'fintech-gradient',
  };

  return (
    <div className={`absolute inset-0 ${backgrounds[variant]} ${className}`}>
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="stockGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M 0 300 Q 150 250 300 280 T 600 260 T 900 290 T 1200 270 T 1500 300 T 1800 280"
          stroke="url(#stockGradient)"
          strokeWidth="2"
          fill="none"
          className="animate-stock-curve"
        />
        <path
          d="M 0 400 Q 150 380 300 420 T 600 390 T 900 430 T 1200 400 T 1500 440 T 1800 410"
          stroke="url(#stockGradient)"
          strokeWidth="1.5"
          fill="none"
          className="animate-stock-curve-delayed"
          opacity="0.6"
        />
      </svg>
      <div className="absolute inset-0 particle-container">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
    </div>
  );
}

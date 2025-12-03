interface GradientBackgroundProps {
  variant?: 'default' | 'minimal' | 'modern' | 'professional';
  className?: string;
}

export function GradientBackground({ variant = 'default', className = '' }: GradientBackgroundProps) {
  const gradients = {
    default: 'from-slate-900 via-blue-900 to-slate-900',
    minimal: 'from-emerald-900 via-teal-900 to-emerald-900',
    modern: 'from-cyan-900 via-blue-900 to-indigo-900',
    professional: 'from-rose-900 via-purple-900 to-indigo-900',
  };

  return (
    <div className={`absolute inset-0 ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[variant]}`}></div>

      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: '200px' }}
      >
        <path
          fill="rgba(255, 255, 255, 0.05)"
          d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,149.3C672,139,768,149,864,170.7C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>

      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: '180px' }}
      >
        <path
          fill="rgba(255, 255, 255, 0.03)"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
}

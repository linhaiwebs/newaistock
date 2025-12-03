interface GradientBackgroundProps {
  variant?: 'default' | 'minimal' | 'modern' | 'professional';
  className?: string;
}

export function GradientBackground({ variant = 'default', className = '' }: GradientBackgroundProps) {
  const backgrounds = {
    default: 'bg-[#2a2a2a]',
    minimal: 'bg-[#2a2a2a]',
    modern: 'bg-[#2a2a2a]',
    professional: 'bg-[#2a2a2a]',
  };

  return (
    <div className={`absolute inset-0 ${backgrounds[variant]} ${className}`}></div>
  );
}

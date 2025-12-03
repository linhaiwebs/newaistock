interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: 'default' | 'minimal' | 'professional' | 'modern';
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  variant = 'default',
  className = ''
}: FeatureCardProps) {
  const variantClasses = {
    default: 'bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow',
    minimal: 'bg-slate-800 rounded-lg p-4 border border-slate-700',
    professional: 'bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all',
    modern: 'bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300',
  };

  const iconClasses = {
    default: 'text-blue-600',
    minimal: 'text-slate-400',
    professional: 'text-sky-700',
    modern: 'text-violet-600',
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      <div className={`mb-4 ${iconClasses[variant]}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

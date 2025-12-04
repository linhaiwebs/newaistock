import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  gradientClass: string;
  iconColor: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  selected = false,
  onClick,
  gradientClass,
  iconColor
}: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        ${gradientClass}
        rounded-2xl p-5 shadow-lg feature-card-hover cursor-pointer
        border border-white/40 relative overflow-hidden
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      `}
    >
      <div className={`flex items-start justify-start mb-3 ${iconColor}`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-left text-base font-bold text-gray-900 mb-1 leading-tight">{title}</h3>
      {description && (
        <p className="text-left text-xs text-gray-700 leading-relaxed">{description}</p>
      )}
    </button>
  );
}

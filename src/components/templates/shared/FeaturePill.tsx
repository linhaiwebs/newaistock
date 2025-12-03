import { LucideIcon } from 'lucide-react';

interface FeaturePillProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onClick: () => void;
  colorClass: string;
}

export function FeaturePill({ icon: Icon, label, selected, onClick, colorClass }: FeaturePillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-6 py-3.5 rounded-full transition-all duration-200
        ${selected
          ? `${colorClass} text-white`
          : 'bg-gray-800/60 text-white/70 hover:bg-gray-800 hover:text-white'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}

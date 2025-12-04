interface ProgressBarProps {
  label: string;
  progress: number;
  color?: string;
  completed?: boolean;
}

export function ProgressBar({ label, progress, color = '#06b6d4', completed = false }: ProgressBarProps) {
  const displayProgress = completed ? 100 : Math.min(progress, 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-500">{displayProgress}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{
            width: `${displayProgress}%`,
            backgroundColor: color,
          }}
        >
          {displayProgress > 0 && displayProgress < 100 && (
            <div
              className="h-full w-full animate-pulse"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

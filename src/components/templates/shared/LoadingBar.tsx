import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingBarProps {
  label: string;
  delay: number;
  className?: string;
  barColor?: string;
}

export function LoadingBar({ label, delay, className = '', barColor = 'from-blue-500 to-indigo-500' }: LoadingBarProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{label}</span>
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${barColor} animate-loading-bar`} />
      </div>
    </div>
  );
}

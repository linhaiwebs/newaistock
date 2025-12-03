import { TrendingUp, BarChart3, Activity, LineChart } from 'lucide-react';

interface StockDecorationsProps {
  variant?: 'default' | 'minimal' | 'modern' | 'professional';
}

export function StockDecorations({ variant = 'default' }: StockDecorationsProps) {
  const colors = {
    default: 'text-blue-500/20',
    minimal: 'text-emerald-500/20',
    modern: 'text-cyan-500/20',
    professional: 'text-rose-500/20',
  };

  return (
    <>
      <div className={`absolute top-20 right-10 ${colors[variant]} hidden lg:block`}>
        <TrendingUp className="w-32 h-32" strokeWidth={1} />
      </div>

      <div className={`absolute top-40 left-10 ${colors[variant]} hidden lg:block`}>
        <BarChart3 className="w-24 h-24 transform rotate-12" strokeWidth={1} />
      </div>

      <div className={`absolute bottom-40 right-20 ${colors[variant]} hidden lg:block`}>
        <Activity className="w-40 h-40 transform -rotate-6" strokeWidth={1} />
      </div>

      <div className={`absolute top-1/2 left-1/4 ${colors[variant]} hidden xl:block`}>
        <LineChart className="w-20 h-20" strokeWidth={1} />
      </div>

      <div className="absolute top-1/3 right-1/4 hidden xl:block">
        <div className={`${colors[variant]} text-5xl font-mono font-bold opacity-10`}>
          <div className="mb-2">↗ +5.2%</div>
          <div className="flex gap-2">
            <div className="w-1 h-12 bg-green-500/30"></div>
            <div className="w-1 h-16 bg-green-500/40"></div>
            <div className="w-1 h-10 bg-red-500/30"></div>
            <div className="w-1 h-20 bg-green-500/50"></div>
            <div className="w-1 h-14 bg-green-500/35"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-1/4 left-1/3 hidden xl:block">
        <div className={`${colors[variant]} opacity-10`}>
          <svg width="80" height="60" viewBox="0 0 80 60">
            <path
              d="M 0 30 Q 20 10, 40 30 T 80 30"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="20" cy="20" r="3" fill="currentColor" />
            <circle cx="40" cy="30" r="3" fill="currentColor" />
            <circle cx="60" cy="20" r="3" fill="currentColor" />
          </svg>
        </div>
      </div>
    </>
  );
}

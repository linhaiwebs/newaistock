import { RobotLoadingAnimation } from './RobotLoadingAnimation';
import { ProgressBar } from './ProgressBar';
import { DecorativeBackground } from './DecorativeBackground';

interface DiagnosisLoadingScreenProps {
  color?: string;
  stages: Array<{
    label: string;
    progress: number;
    completed?: boolean;
  }>;
}

export function DiagnosisLoadingScreen({ color = '#06b6d4', stages }: DiagnosisLoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6 relative overflow-hidden">
      <DecorativeBackground color={color} opacity={0.15} />

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative inline-block">
            <div
              className="absolute inset-0 blur-2xl opacity-30 animate-pulse"
              style={{
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                animationDuration: '2s',
              }}
            />
            <RobotLoadingAnimation color={color} />
          </div>
          <h2 className="text-4xl font-light text-gray-900 mt-8 mb-4 animate-slide-up">
            AI診断中
          </h2>
          <p className="text-gray-600 text-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
            高度なアルゴリズムで分析しています...
          </p>
        </div>

        <div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6 animate-slide-up border"
          style={{
            animationDelay: '0.2s',
            borderColor: `${color}20`,
          }}
        >
          {stages.map((stage, index) => (
            <ProgressBar
              key={index}
              label={stage.label}
              progress={stage.progress}
              color={color}
              completed={stage.completed}
            />
          ))}
        </div>

        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm text-gray-500">
            この処理には数秒かかる場合があります
          </p>
        </div>
      </div>
    </div>
  );
}

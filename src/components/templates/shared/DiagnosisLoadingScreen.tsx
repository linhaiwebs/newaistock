import { RobotLoadingAnimation } from './RobotLoadingAnimation';
import { ProgressBar } from './ProgressBar';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <RobotLoadingAnimation color={color} />
          <h2 className="text-4xl font-light text-gray-900 mt-8 mb-4">
            AI診断中
          </h2>
          <p className="text-gray-600 text-lg">
            高度なアルゴリズムで分析しています...
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
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

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            この処理には数秒かかる場合があります
          </p>
        </div>
      </div>
    </div>
  );
}

import { Sparkles, TrendingUp, BarChart3 } from 'lucide-react';
import { FeatureCard } from '../shared/FeatureCard';

interface FeaturesSectionProps {
  getContent: (key: string, defaultValue?: string) => string;
}

export function FeaturesSection({ getContent }: FeaturesSectionProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Sparkles className="w-6 h-6" />}
          title={getContent('feature_1_title', '实时数据分析')}
          description={getContent('feature_1_description', '获取最新的股票市场数据并进行深度分析')}
          variant="default"
        />
        <FeatureCard
          icon={<TrendingUp className="w-6 h-6" />}
          title={getContent('feature_2_title', 'AI智能诊断')}
          description={getContent('feature_2_description', '利用先进的AI算法提供专业的投资建议')}
          variant="default"
        />
        <FeatureCard
          icon={<BarChart3 className="w-6 h-6" />}
          title={getContent('feature_3_title', '详细分析报告')}
          description={getContent('feature_3_description', '生成全面的股票分析报告，助您做出明智决策')}
          variant="default"
        />
      </div>
    </div>
  );
}

import { TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  getContent: (key: string, defaultValue?: string) => string;
}

export function HeroSection({ getContent }: HeroSectionProps) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-lg">
        <TrendingUp className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        {getContent('hero_title', 'AI股票诊断')}
      </h1>
      <p className="text-xl text-gray-600 mb-2">
        {getContent('hero_subtitle', '最新的AI技术为您分析股票')}
      </p>
      <p className="text-gray-500">
        {getContent('hero_description', '输入股票代码，立即获取详细的投资分析报告')}
      </p>
    </div>
  );
}

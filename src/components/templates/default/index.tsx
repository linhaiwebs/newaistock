import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { HeroSection } from './HeroSection';
import { DiagnosisForm } from './DiagnosisForm';
import { FeaturesSection } from './FeaturesSection';
import { ResultView } from './ResultView';
import { AnalyzingView } from './AnalyzingView';

export function TemplateDefault({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();

  if (diagnosis.showResult) {
    return (
      <ResultView
        result={diagnosis.result}
        stockName={diagnosis.stockName}
        redirectUrl={diagnosis.redirectUrl}
        onConversion={diagnosis.handleConversion}
        onBack={diagnosis.resetDiagnosis}
        getContent={getContent}
      />
    );
  }

  if (diagnosis.analyzing) {
    return (
      <AnalyzingView
        result={diagnosis.result}
        getContent={getContent}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <HeroSection getContent={getContent} />
        <DiagnosisForm
          stockCode={diagnosis.stockCode}
          setStockCode={diagnosis.setStockCode}
          loading={diagnosis.loading}
          analyzing={diagnosis.analyzing}
          onDiagnose={diagnosis.handleDiagnose}
          getContent={getContent}
        />
        <FeaturesSection getContent={getContent} />
      </div>
    </div>
  );
}

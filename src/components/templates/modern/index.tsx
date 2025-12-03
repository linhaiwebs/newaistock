import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { Rocket, Loader2, ArrowRight, Cpu, Network, Binary, Zap, ArrowLeft } from 'lucide-react';
import Footer from '../shared/Footer';

export function TemplateModern({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();

  if (diagnosis.showResult) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={diagnosis.resetDiagnosis}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono">← RETURN</span>
          </button>

          <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-cyan-500/30 rounded-lg p-8 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                {getContent('result_title', 'ANALYSIS COMPLETE')}
              </h2>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-600 rounded-full"></div>
              <div className="text-cyan-50/90 whitespace-pre-wrap leading-relaxed font-mono text-sm pl-4">
                {diagnosis.result}
              </div>
            </div>

            {diagnosis.redirectUrl && (
              <button
                onClick={diagnosis.handleConversion}
                className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 px-8 rounded-lg font-bold text-lg transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10 font-mono">{getContent('result_button_text', 'EXPLORE MORE →')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (diagnosis.analyzing) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>

        <div className="relative max-w-2xl mx-auto px-4">
          <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-cyan-500/30 rounded-lg p-12 text-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg mb-6 relative">
                <Cpu className="w-10 h-10 text-white animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg blur-xl opacity-50 animate-pulse"></div>
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2 font-mono">
                {getContent('analyzing_title', 'QUANTUM ANALYSIS IN PROGRESS')}
              </h2>
              <p className="text-cyan-300/70 font-mono text-sm">
                {getContent('analyzing_description', 'Scanning market data...')}
              </p>
              <div className="flex items-center justify-center gap-1 mt-4">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>

            {diagnosis.result && (
              <div className="mt-8 pt-8 border-t border-cyan-500/20 text-left">
                <div className="text-cyan-50/80 whitespace-pre-wrap leading-relaxed font-mono text-sm animate-fadeIn">
                  {diagnosis.result}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-8 shadow-[0_0_40px_rgba(6,182,212,0.4)] relative group">
            <Rocket className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
          </div>
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 font-mono">
              {getContent('hero_title', 'CYBERSTOCK AI')}
            </span>
          </h1>
          <p className="text-2xl text-cyan-300 mb-3 font-mono">
            {getContent('hero_subtitle', 'Next-Gen Market Analysis')}
          </p>
          <p className="text-lg text-cyan-400/60 font-mono">
            {getContent('hero_description', 'Powered by quantum algorithms')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-slate-900/60 backdrop-blur-xl border-2 border-cyan-500/30 rounded-lg p-8 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all duration-300">
            <label className="block text-sm font-bold text-cyan-400 mb-3 font-mono flex items-center gap-2">
              <Binary className="w-4 h-4" />
              STOCK CODE
            </label>
            <input
              type="text"
              value={diagnosis.stockCode}
              onChange={(e) => diagnosis.setStockCode(e.target.value)}
              placeholder="例: 1031"
              className="w-full px-6 py-4 text-lg bg-slate-800/50 border-2 border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-500/30 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all font-mono backdrop-blur-sm"
              disabled={diagnosis.loading || diagnosis.analyzing}
            />

            <button
              onClick={diagnosis.handleDiagnose}
              disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
              className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 px-8 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              {diagnosis.loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-mono">LOADING...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span className="font-mono">{getContent('hero_button_text', 'LAUNCH ANALYSIS')}</span>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-slate-900/60 backdrop-blur-xl border-2 border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
              <Network className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-cyan-300 mb-2 font-mono">
              {getContent('feature_1_title', 'NEURAL NETWORK')}
            </h3>
            <p className="text-cyan-400/60 text-sm font-mono">
              {getContent('feature_1_description', 'Deep learning algorithms analyze market patterns')}
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border-2 border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-cyan-300 mb-2 font-mono">
              {getContent('feature_2_title', 'INSTANT COMPUTE')}
            </h3>
            <p className="text-cyan-400/60 text-sm font-mono">
              {getContent('feature_2_description', 'Millisecond response time for real-time analysis')}
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border-2 border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-cyan-300 mb-2 font-mono">
              {getContent('feature_3_title', 'QUANTUM PRECISION')}
            </h3>
            <p className="text-cyan-400/60 text-sm font-mono">
              {getContent('feature_3_description', 'Advanced quantum computing for predictive accuracy')}
            </p>
          </div>
        </div>
      </div>

      {template.footerConfig && (
        <div className="relative mt-16 border-t border-cyan-500/20">
          <Footer footerConfig={template.footerConfig} variant="modern" />
        </div>
      )}
    </div>
  );
}

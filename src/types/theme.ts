export interface TemplateTheme {
  name: string;
  colors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    background: string;
    gradientFrom: string;
    gradientTo: string;
  };
  cards: {
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
  };
}

export const templateThemes: Record<string, TemplateTheme> = {
  default: {
    name: 'Default',
    colors: {
      primary: '#06b6d4',
      primaryHover: '#0891b2',
      primaryLight: '#67e8f9',
      secondary: '#0e7490',
      accent: '#22d3ee',
      background: '#ecfeff',
      gradientFrom: '#ecfeff',
      gradientTo: '#ffffff',
    },
    cards: {
      feature1: 'bg-blue-50',
      feature2: 'bg-green-50',
      feature3: 'bg-orange-50',
      feature4: 'bg-gray-100',
    },
  },
  modern: {
    name: 'Modern',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      primaryLight: '#93c5fd',
      secondary: '#1d4ed8',
      accent: '#60a5fa',
      background: '#eff6ff',
      gradientFrom: '#dbeafe',
      gradientTo: '#ffffff',
    },
    cards: {
      feature1: 'bg-blue-50',
      feature2: 'bg-sky-50',
      feature3: 'bg-indigo-50',
      feature4: 'bg-gray-100',
    },
  },
  professional: {
    name: 'Professional',
    colors: {
      primary: '#f43f5e',
      primaryHover: '#e11d48',
      primaryLight: '#fda4af',
      secondary: '#be123c',
      accent: '#fb7185',
      background: '#fff1f2',
      gradientFrom: '#ffe4e6',
      gradientTo: '#ffffff',
    },
    cards: {
      feature1: 'bg-rose-50',
      feature2: 'bg-pink-50',
      feature3: 'bg-red-50',
      feature4: 'bg-gray-100',
    },
  },
  minimal: {
    name: 'Minimal',
    colors: {
      primary: '#10b981',
      primaryHover: '#059669',
      primaryLight: '#6ee7b7',
      secondary: '#047857',
      accent: '#34d399',
      background: '#ecfdf5',
      gradientFrom: '#d1fae5',
      gradientTo: '#ffffff',
    },
    cards: {
      feature1: 'bg-emerald-50',
      feature2: 'bg-teal-50',
      feature3: 'bg-green-50',
      feature4: 'bg-gray-100',
    },
  },
  'tech-future': {
    name: 'Tech Future',
    colors: {
      primary: '#0ea5e9',
      primaryHover: '#0284c7',
      primaryLight: '#7dd3fc',
      secondary: '#0c4a6e',
      accent: '#22d3ee',
      background: '#0f172a',
      gradientFrom: '#1e293b',
      gradientTo: '#0f172a',
    },
    cards: {
      feature1: 'bg-slate-800',
      feature2: 'bg-slate-700',
      feature3: 'bg-slate-800',
      feature4: 'bg-slate-900',
    },
  },
  'zen-minimal': {
    name: 'Zen Minimal',
    colors: {
      primary: '#000000',
      primaryHover: '#1f2937',
      primaryLight: '#6b7280',
      secondary: '#374151',
      accent: '#10b981',
      background: '#ffffff',
      gradientFrom: '#f9fafb',
      gradientTo: '#ffffff',
    },
    cards: {
      feature1: 'bg-gray-50',
      feature2: 'bg-white',
      feature3: 'bg-gray-50',
      feature4: 'bg-white',
    },
  },
  'finance-pro': {
    name: 'Finance Pro',
    colors: {
      primary: '#1e40af',
      primaryHover: '#1e3a8a',
      primaryLight: '#60a5fa',
      secondary: '#172554',
      accent: '#fbbf24',
      background: '#eff6ff',
      gradientFrom: '#dbeafe',
      gradientTo: '#f0f9ff',
    },
    cards: {
      feature1: 'bg-blue-900',
      feature2: 'bg-blue-800',
      feature3: 'bg-slate-800',
      feature4: 'bg-slate-700',
    },
  },
  'gradient-fluid': {
    name: 'Gradient Fluid',
    colors: {
      primary: '#a855f7',
      primaryHover: '#9333ea',
      primaryLight: '#c084fc',
      secondary: '#7c3aed',
      accent: '#ec4899',
      background: '#faf5ff',
      gradientFrom: '#fae8ff',
      gradientTo: '#fce7f3',
    },
    cards: {
      feature1: 'bg-purple-100',
      feature2: 'bg-pink-100',
      feature3: 'bg-fuchsia-100',
      feature4: 'bg-violet-100',
    },
  },
  'dark-neon': {
    name: 'Dark Neon',
    colors: {
      primary: '#10b981',
      primaryHover: '#059669',
      primaryLight: '#34d399',
      secondary: '#14532d',
      accent: '#ec4899',
      background: '#000000',
      gradientFrom: '#000000',
      gradientTo: '#0a0a0a',
    },
    cards: {
      feature1: 'bg-black',
      feature2: 'bg-black',
      feature3: 'bg-black',
      feature4: 'bg-black',
    },
  },
  'glass-morph': {
    name: 'Glass Morph',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      primaryLight: '#60a5fa',
      secondary: '#1e40af',
      accent: '#06b6d4',
      background: '#f0f9ff',
      gradientFrom: '#e0f2fe',
      gradientTo: '#f0f9ff',
    },
    cards: {
      feature1: 'bg-white/40',
      feature2: 'bg-white/40',
      feature3: 'bg-white/40',
      feature4: 'bg-white/40',
    },
  },
  'card-grid': {
    name: 'Card Grid',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      primaryLight: '#93c5fd',
      secondary: '#1d4ed8',
      accent: '#06b6d4',
      background: '#f8fafc',
      gradientFrom: '#f1f5f9',
      gradientTo: '#ffffff',
    },
    cards: {
      feature1: 'bg-blue-100',
      feature2: 'bg-emerald-100',
      feature3: 'bg-amber-100',
      feature4: 'bg-rose-100',
    },
  },
  'ultra-lines': {
    name: 'Ultra Lines',
    colors: {
      primary: '#18181b',
      primaryHover: '#09090b',
      primaryLight: '#52525b',
      secondary: '#27272a',
      accent: '#71717a',
      background: '#ffffff',
      gradientFrom: '#fafafa',
      gradientTo: '#ffffff',
    },
    cards: {
      feature1: 'bg-white',
      feature2: 'bg-white',
      feature3: 'bg-white',
      feature4: 'bg-white',
    },
  },
  'warm-orange': {
    name: 'Warm Orange',
    colors: {
      primary: '#f97316',
      primaryHover: '#ea580c',
      primaryLight: '#fb923c',
      secondary: '#c2410c',
      accent: '#fbbf24',
      background: '#fff7ed',
      gradientFrom: '#ffedd5',
      gradientTo: '#fef3c7',
    },
    cards: {
      feature1: 'bg-orange-100',
      feature2: 'bg-amber-100',
      feature3: 'bg-yellow-100',
      feature4: 'bg-orange-50',
    },
  },
  'business-premium': {
    name: 'Business Premium',
    colors: {
      primary: '#475569',
      primaryHover: '#334155',
      primaryLight: '#94a3b8',
      secondary: '#1e293b',
      accent: '#d4af37',
      background: '#f8fafc',
      gradientFrom: '#f1f5f9',
      gradientTo: '#e2e8f0',
    },
    cards: {
      feature1: 'bg-slate-100',
      feature2: 'bg-slate-200',
      feature3: 'bg-gray-100',
      feature4: 'bg-gray-200',
    },
  },
};

export function getTemplateTheme(templateKey: string): TemplateTheme {
  return templateThemes[templateKey] || templateThemes.default;
}

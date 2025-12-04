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
};

export function getTemplateTheme(templateKey: string): TemplateTheme {
  return templateThemes[templateKey] || templateThemes.default;
}

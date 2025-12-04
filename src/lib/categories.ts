export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export const TEMPLATE_CATEGORIES: Record<string, TemplateCategory> = {
  'stock-analysis': {
    id: 'stock-analysis',
    name: 'Stock Analysis',
    description: 'Templates for stock market analysis and predictions',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '📈',
  },
  'crypto': {
    id: 'crypto',
    name: 'Cryptocurrency',
    description: 'Templates for cryptocurrency trading and analysis',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '₿',
  },
  'forex': {
    id: 'forex',
    name: 'Forex Trading',
    description: 'Templates for foreign exchange market analysis',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '💱',
  },
  'commodities': {
    id: 'commodities',
    name: 'Commodities',
    description: 'Templates for commodity trading and futures',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '🏅',
  },
  'ai-guide': {
    id: 'ai-guide',
    name: 'AI Guide',
    description: 'AI-powered intelligent guide page templates',
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    icon: '🤖',
  },
  'options': {
    id: 'options',
    name: 'Options Trading',
    description: 'Templates for options and derivatives trading',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '📊',
  },
  'general': {
    id: 'general',
    name: 'General',
    description: 'General purpose templates',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '📄',
  },
};

export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  ...Object.values(TEMPLATE_CATEGORIES).map(cat => ({
    value: cat.id,
    label: cat.name,
  })),
];

export function getCategoryInfo(categoryId: string | null | undefined): TemplateCategory {
  if (!categoryId) {
    return TEMPLATE_CATEGORIES['general'];
  }
  return TEMPLATE_CATEGORIES[categoryId] || TEMPLATE_CATEGORIES['general'];
}

export function getCategoryBadgeClass(categoryId: string | null | undefined): string {
  const category = getCategoryInfo(categoryId);
  return category.color;
}

export function getCategoryIcon(categoryId: string | null | undefined): string {
  const category = getCategoryInfo(categoryId);
  return category.icon;
}

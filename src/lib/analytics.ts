import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let isGtagLoaded = false;

export async function initializeAnalytics() {
  try {
    const { data } = await supabase
      .from('analytics_config')
      .select('*')
      .eq('enabled', true)
      .maybeSingle();

    if (data && data.ga4_measurement_id) {
      loadGtag(data.ga4_measurement_id, data.google_ads_conversion_id);
    }
  } catch (error) {
    console.error('Analytics initialization error:', error);
  }
}

function loadGtag(measurementId: string, adsConversionId?: string) {
  if (isGtagLoaded) return;

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
    ${adsConversionId ? `gtag('config', '${adsConversionId}');` : ''}
  `;
  document.head.appendChild(script2);

  isGtagLoaded = true;
}

export function trackDiagnosisClick() {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'Bdd');
  }
}

export function trackConversionClick() {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'Add');
  }
}

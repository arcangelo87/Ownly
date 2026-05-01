export const SECTOR_LABELS: Record<string, string> = {
  manufacturing: 'Manufacturing',
  food_beverage: 'Food & Beverage',
  professional_services: 'Professional Services',
  wholesale: 'Wholesale & Distribution',
  construction: 'Construction & Engineering',
  technology: 'Technology',
  other: 'Other',
};

export function formatRevenue(val: string | null): string {
  const map: Record<string, string> = {
    under_500k: '<€500k', '500k_1m': '€500k–1M', '1m_2_5m': '€1–2.5M',
    '2_5m_5m': '€2.5–5M', over_5m: '>€5M',
  };
  return val ? (map[val] ?? val) : '—';
}

export function formatOwnerInvolvement(val: string | null): string {
  const map: Record<string, string> = {
    full_time: 'Full-time (40+ hrs/wk)',
    part_time: 'Part-time (20–40 hrs/wk)',
    advisory: 'Advisory (5–20 hrs/wk)',
    minimal: 'Minimal (<5 hrs/wk)',
  };
  return val ? (map[val] ?? val) : '—';
}

export function formatEmployees(val: string | null): string {
  const map: Record<string, string> = {
    just_me: 'Just me', '2_5': '2–5', '6_15': '6–15', '16_30': '16–30', '30_plus': '30+',
  };
  return val ? (map[val] ?? val) : '—';
}

export function formatEbitda(val: string | null): string {
  const map: Record<string, string> = {
    below_10: '<10%', '10_20': '10–20%', '20_35': '20–35%', above_35: '>35%', not_sure: 'Not sure',
  };
  return val ? (map[val] ?? val) : '—';
}

export function formatPrice(val: string | null): string {
  const map: Record<string, string> = {
    under_500k: '<€500k', '500k_1m': '€500k–€1M', '1m_2_5m': '€1M–€2.5M',
    '2_5m_5m': '€2.5M–€5M', '5m_10m': '€5M–€10M', over_10m: '>€10M',
  };
  return val ? (map[val] ?? val) : '—';
}

export function formatPartialSale(val: string | null): string {
  if (!val) return '—';
  return val === 'open_to_minority' ? 'Open to partial sale' : 'Full sale only';
}

export function formatTimeline(val: string | null): string {
  const map: Record<string, string> = {
    ready_now: 'Ready now (<6 mo)', '6_12_months': '6–12 months',
    '1_2_years': '1–2 years', exploring: 'Just exploring',
  };
  return val ? (map[val] ?? val) : '—';
}

export function formatReasons(val: string[] | null): string {
  if (!val || val.length === 0) return '—';
  const map: Record<string, string> = {
    retirement: 'Retirement', growth_capital: 'Growth capital', no_succession: 'No succession',
    health_personal: 'Health/personal', market_opportunity: 'Market opportunity', other: 'Other',
  };
  return val.map((r) => map[r] ?? r).join(', ');
}

export function generateSlug(sector: string, region: string, country: string): string {
  const slugify = (s: string) =>
    s.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  const countrySlug = country === 'IT' ? 'italy' : country === 'PT' ? 'portugal' : slugify(country);
  const sectorLabel = SECTOR_LABELS[sector] ?? sector;
  return [sectorLabel, region, countrySlug].map(slugify).join('-');
}

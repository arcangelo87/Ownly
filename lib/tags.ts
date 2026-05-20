export const BUYER_TAGS = [
  'Owner-operator',
  'Passive income',
  'Lifestyle acquisition',
  'Succession opportunity',
  'Bolt-on acquisition',
  'Portfolio add-on',
  'Turnaround',
  'Growth capital',
  'First acquisition',
  'Recurring revenue',
  'Asset-light',
  'Family business',
] as const;

export type BuyerTag = (typeof BUYER_TAGS)[number];

const BUYER_TAGS_IT: Record<string, string> = {
  'Owner-operator':        'Gestione diretta',
  'Passive income':        'Reddito passivo',
  'Lifestyle acquisition': 'Acquisizione lifestyle',
  'Succession opportunity':'Opportunità di successione',
  'Bolt-on acquisition':   'Acquisizione complementare',
  'Portfolio add-on':      'Aggiunta al portafoglio',
  'Turnaround':            'Turnaround',
  'Growth capital':        'Capitale di crescita',
  'First acquisition':     'Prima acquisizione',
  'Recurring revenue':     'Ricavi ricorrenti',
  'Asset-light':           'Asset-light',
  'Family business':       'Azienda familiare',
};

const BUYER_TAGS_PT: Record<string, string> = {
  'Owner-operator':        'Gestão direta',
  'Passive income':        'Rendimento passivo',
  'Lifestyle acquisition': 'Aquisição lifestyle',
  'Succession opportunity':'Oportunidade de sucessão',
  'Bolt-on acquisition':   'Aquisição complementar',
  'Portfolio add-on':      'Adição ao portfólio',
  'Turnaround':            'Turnaround',
  'Growth capital':        'Capital de crescimento',
  'First acquisition':     'Primeira aquisição',
  'Recurring revenue':     'Receitas recorrentes',
  'Asset-light':           'Asset-light',
  'Family business':       'Empresa familiar',
};

export function translateTags(tags: string[] | null, locale: 'it' | 'pt'): string[] | null {
  if (!tags) return null;
  const map = locale === 'it' ? BUYER_TAGS_IT : BUYER_TAGS_PT;
  return tags.map((t) => map[t] ?? t);
}

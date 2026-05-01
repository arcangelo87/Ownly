'use client';

import { useEffect, useState } from 'react';
import { DealCard } from '@/components/deals/DealCard';
import type { ListingCard } from '@/app/[locale]/deals/page';

const CARDS: ListingCard[] = [
  {
    id: 'mock-1',
    slug: null,
    title: 'Established artisan food producer with long-term wholesale contracts across northern Italy.',
    sector: 'food_beverage',
    region: 'Tuscany',
    country: 'IT',
    revenue_range: '1m_2_5m',
    ebitda_margin: '20_35',
    asking_price: '1m_2_5m',
    employee_count: null,
    timeline: null,
    created_at: '2026-01-01T00:00:00Z',
    coverPhotoUrl: null,
    photoCount: 0,
    buyer_tags: ['Lifestyle buyer', 'Strategic buyer'],
    owner_involvement: 'part_time',
  },
  {
    id: 'mock-2',
    slug: null,
    title: 'Precision metalwork manufacturer serving automotive and industrial clients across the Iberian Peninsula.',
    sector: 'manufacturing',
    region: 'Porto',
    country: 'PT',
    revenue_range: '2_5m_5m',
    ebitda_margin: 'above_35',
    asking_price: '2_5m_5m',
    employee_count: null,
    timeline: null,
    created_at: '2026-01-01T00:00:00Z',
    coverPhotoUrl: null,
    photoCount: 0,
    buyer_tags: ['Financial buyer', 'Strategic buyer'],
    owner_involvement: 'advisory',
  },
  {
    id: 'mock-3',
    slug: null,
    title: 'Specialist accounting and compliance firm with a loyal SME client base built over 15 years.',
    sector: 'professional_services',
    region: 'Milan',
    country: 'IT',
    revenue_range: '500k_1m',
    ebitda_margin: '10_20',
    asking_price: '500k_1m',
    employee_count: null,
    timeline: null,
    created_at: '2026-01-01T00:00:00Z',
    coverPhotoUrl: null,
    photoCount: 0,
    buyer_tags: ['Lifestyle buyer', 'Owner-operator'],
    owner_involvement: 'full_time',
  },
  {
    id: 'mock-4',
    slug: null,
    title: 'Regional wholesale distributor of specialty food & beverage products with exclusive supplier agreements.',
    sector: 'wholesale',
    region: 'Algarve',
    country: 'PT',
    revenue_range: '1m_2_5m',
    ebitda_margin: '20_35',
    asking_price: '1m_2_5m',
    employee_count: null,
    timeline: null,
    created_at: '2026-01-01T00:00:00Z',
    coverPhotoUrl: null,
    photoCount: 0,
    buyer_tags: ['Financial buyer', 'Strategic buyer'],
    owner_involvement: 'minimal',
  },
];

export function DealCardStack() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % CARDS.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-[340px] shrink-0" style={{ height: 'auto' }}>
      {/* Peek cards behind */}
      {[2, 1].map((offset) => {
        const index = (active + offset) % CARDS.length;
        const depth = offset === 2 ? 2 : 1;
        return (
          <div
            key={`behind-${depth}`}
            className="absolute inset-0 transition-all duration-500 ease-in-out pointer-events-none"
            style={{
              transform: `translateY(${depth * 10}px) translateX(${depth * 8}px) scale(${1 - depth * 0.04})`,
              zIndex: 10 - depth,
              opacity: 1 - depth * 0.15,
            }}
            aria-hidden="true"
          >
            <DealCard listing={CARDS[index]} />
          </div>
        );
      })}

      {/* Active (top) card */}
      <div
        className="relative transition-all duration-500 ease-in-out"
        style={{ zIndex: 10 }}
      >
        <DealCard listing={CARDS[active]} />
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-[6px] mt-4">
        {CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="w-[6px] h-[6px] rounded-full transition-colors duration-300"
            style={{
              background: i === active ? 'var(--color-accent)' : 'var(--color-border)',
            }}
            aria-label={`View card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

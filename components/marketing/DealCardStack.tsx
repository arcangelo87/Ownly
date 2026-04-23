'use client';

import { useEffect, useState } from 'react';
import { MockDealCard } from './MockDealCard';

const CARDS = [
  {
    sector: 'Food & Beverage',
    location: 'Tuscany, Italy',
    title: 'Established artisan food producer with long-term wholesale contracts across northern Italy.',
    revenue: '€1–2.5M',
    ebitda: '20–35%',
    asking: '€1–2M',
    employees: 8,
    timeline: 'Ready in 6–12 mo',
  },
  {
    sector: 'Manufacturing',
    location: 'Porto, Portugal',
    title: 'Precision metalwork manufacturer serving automotive and industrial clients across the Iberian Peninsula.',
    revenue: '€2.5–5M',
    ebitda: '35%+',
    asking: '€2–4M',
    employees: 32,
    timeline: 'Ready now',
  },
  {
    sector: 'Professional Services',
    location: 'Milan, Italy',
    title: 'Specialist accounting and compliance firm with a loyal SME client base built over 15 years.',
    revenue: '€500k–1M',
    ebitda: '10–20%',
    asking: '<€1M',
    employees: 5,
    timeline: '12+ mo horizon',
  },
  {
    sector: 'Wholesale & Distribution',
    location: 'Algarve, Portugal',
    title: 'Regional wholesale distributor of specialty food & beverage products with exclusive supplier agreements.',
    revenue: '€1–2.5M',
    ebitda: '20–35%',
    asking: '€1–2M',
    employees: 12,
    timeline: 'Ready in 6–12 mo',
  },
] as const;

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
            <MockDealCard {...CARDS[index]} />
          </div>
        );
      })}

      {/* Active (top) card */}
      <div
        className="relative transition-all duration-500 ease-in-out"
        style={{ zIndex: 10 }}
      >
        <MockDealCard {...CARDS[active]} />
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

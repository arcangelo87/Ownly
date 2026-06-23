'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-t border-[var(--color-border)]">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className="border-b border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 py-6 text-left"
            >
              <span className="font-[family-name:var(--font-serif)] text-[17px] md:text-[18px] font-medium tracking-[-0.01em] text-[var(--color-text)]">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-[var(--color-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <p className="pb-6 -mt-2 text-[15px] text-[var(--color-muted)] leading-[1.7] max-w-[640px]">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

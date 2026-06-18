'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className="border-b border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-[16px] font-medium text-[var(--color-text)]">
                {item.question}
              </span>
              <ChevronDown
                className={`shrink-0 text-[var(--color-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                size={18}
              />
            </button>
            {isOpen && (
              <p className="pb-5 text-[14px] text-[var(--color-muted)] leading-[1.7] max-w-[640px]">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useState } from 'react';

interface PhotoStripProps {
  urls: string[];
  alt: string;
  emptyLabel: string;
}

export function PhotoStrip({ urls, alt, emptyLabel }: PhotoStripProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (urls.length === 0) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-md bg-[var(--color-surface)]">
        <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
          {emptyLabel}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative h-[240px] w-full overflow-hidden rounded-md bg-[var(--color-surface)]">
        <Image
          src={urls[activeIndex]}
          alt={alt}
          fill
          className="object-cover"
          priority
        />
        {urls.length > 1 && (
          <span className="absolute bottom-2.5 right-2.5 rounded bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
            {activeIndex + 1} / {urls.length}
          </span>
        )}
      </div>
      {urls.length > 1 && (
        <div className="flex gap-2">
          {urls.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={[
                'relative h-14 w-14 flex-shrink-0 overflow-hidden rounded border-[1.5px] transition-opacity',
                i === activeIndex
                  ? 'border-[var(--color-accent)]'
                  : 'border-[var(--color-border)] opacity-60 hover:opacity-100',
              ].join(' ')}
            >
              <Image src={url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

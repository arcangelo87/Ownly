'use client';

import { useEffect, useRef, useState } from 'react';

interface RollingWordProps {
  words: string[];
  interval?: number;
}

// Rolls through words in place, easing the width between them. The first word
// is the only one in the server HTML, so crawlers and screen readers read it.
// Reduced motion keeps it static.
export function RollingWord({ words, interval = 2500 }: RollingWordProps) {
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(false);
  const [widths, setWidths] = useState<number[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (words.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setAnimated(true);
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  // Measure each word once rendered, so the box can ease between their widths
  // and the text after it stays snug. The padding, offset by the negative
  // margin, keeps italic overhangs from being clipped.
  useEffect(() => {
    if (!animated) return;
    setWidths(wordRefs.current.map((el) => el?.offsetWidth ?? 0));
  }, [animated, words]);

  if (!animated) return <span>{words[0]}</span>;

  return (
    <span
      className="-mx-[0.1em] inline-grid justify-items-start overflow-hidden transition-[width] duration-500 ease-out"
      style={widths[index] ? { width: widths[index] } : undefined}
    >
      {words.map((word, i) => {
        const offset = (i - index + words.length) % words.length;
        const position =
          offset === 0
            ? 'translate-y-0 opacity-100'
            : offset === words.length - 1
              ? '-translate-y-full opacity-0'
              : 'translate-y-full opacity-0';
        return (
          <span
            key={word}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            aria-hidden={i !== 0}
            className={`[grid-area:1/1] whitespace-nowrap px-[0.1em] transition-[translate,opacity] duration-500 ease-out ${position}`}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}

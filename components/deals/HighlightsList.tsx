export function HighlightsList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className="mt-[7px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-[var(--color-accent)]"
            aria-hidden="true"
          />
          <span className="text-[14px] leading-[1.65] text-[var(--color-text)]">{item}</span>
        </li>
      ))}
    </ul>
  );
}

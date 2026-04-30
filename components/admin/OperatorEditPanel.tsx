'use client';

import { useState, useTransition } from 'react';
import { updateListingContent } from '@/app/actions/admin';
import type { Listing } from '@/types';

interface Props {
  listing: Listing;
  onSave: (updated: Partial<Listing>) => void;
}

export function OperatorEditPanel({ listing, onSave }: Props) {
  const [title, setTitle] = useState(listing.title ?? '');
  const [about, setAbout] = useState(listing.about ?? '');
  const [highlightsText, setHighlightsText] = useState(
    (listing.highlights ?? []).join('\n'),
  );
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const highlights = highlightsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      await updateListingContent(listing.id, {
        title: title.trim() || null,
        about: about.trim() || null,
        highlights: highlights.length > 0 ? highlights : null,
      });
      onSave({
        title: title.trim() || null,
        about: about.trim() || null,
        highlights: highlights.length > 0 ? highlights : null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="mt-4 flex flex-col gap-4 border-t border-[var(--color-border)] pt-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--color-muted)]">
        Operator content
      </p>

      {listing.slug && (
        <div className="flex items-center justify-between rounded-md bg-[#EBF1ED] px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--color-accent)]">Slug</span>
            <span className="font-mono text-[12px] text-[var(--color-accent)]">{listing.slug}</span>
          </div>
          <a
            href={`/en/deals/${listing.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-medium text-[var(--color-accent)] underline underline-offset-2 hover:opacity-70"
          >
            View live →
          </a>
        </div>
      )}

      <div>
        <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A compelling deal title visible to buyers"
          className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)]"
        />
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">About the business</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Operator-written summary shown on the deal page"
          rows={4}
          className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)] placeholder:text-[var(--color-muted)]"
        />
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">
          Highlights <span className="font-normal">(one per line, 3–5 bullets)</span>
        </label>
        <textarea
          value={highlightsText}
          onChange={(e) => setHighlightsText(e.target.value)}
          placeholder={'20-year operating history\nExclusive supplier agreement\nStrong repeat revenue base'}
          rows={5}
          className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)] placeholder:text-[var(--color-muted)]"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={pending}
          className="rounded-md bg-[var(--color-accent)] px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-[0.88] disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save content'}
        </button>
        {saved && (
          <span className="text-[12px] text-[var(--color-accent)]">Saved ✓</span>
        )}
      </div>
    </div>
  );
}

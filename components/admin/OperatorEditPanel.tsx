'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { updateListingContent, deleteListingPhoto, getListingPhotos } from '@/app/actions/admin';
import { createPhotoUploadUrl } from '@/app/actions/deals';
import { createClient } from '@/lib/supabase/client';
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
  const [buyerTagsText, setBuyerTagsText] = useState(
    (listing.buyer_tags ?? []).join('\n'),
  );
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getListingPhotos(listing.id).then((data) => {
      setPhotos(data);
      setPhotosLoading(false);
    });
  }, [listing.id]);

  async function handlePhotoUpload(files: FileList) {
    if (!files.length) return;
    setUploading(true);
    const supabase = createClient();
    try {
      const added: { name: string; url: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const index = Date.now() + i;
        const signedUrl = await createPhotoUploadUrl(listing.id, index, file.name);
        await fetch(signedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });
        const path = `${index}-${file.name}`;
        const { data: { publicUrl } } = supabase.storage
          .from('listing-photos')
          .getPublicUrl(`${listing.id}/${path}`);
        added.push({ name: path, url: publicUrl });
      }
      setPhotos((prev) => [...prev, ...added]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDeletePhoto(name: string) {
    await deleteListingPhoto(listing.id, name);
    setPhotos((prev) => prev.filter((p) => p.name !== name));
  }

  function handleSave() {
    const highlights = highlightsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const buyer_tags = buyerTagsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      await updateListingContent(listing.id, {
        title: title.trim() || null,
        about: about.trim() || null,
        highlights: highlights.length > 0 ? highlights : null,
        buyer_tags: buyer_tags.length > 0 ? buyer_tags : null,
      });
      onSave({
        title: title.trim() || null,
        about: about.trim() || null,
        highlights: highlights.length > 0 ? highlights : null,
        buyer_tags: buyer_tags.length > 0 ? buyer_tags : null,
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
        <label className="mb-2 block text-[11px] font-semibold text-[var(--color-muted)]">Photos</label>
        {photosLoading ? (
          <p className="text-[12px] text-[var(--color-muted)]">Loading…</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {photos.map((photo) => (
              <div
                key={photo.name}
                className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)]"
              >
                <img src={photo.url} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => handleDeletePhoto(photo.name)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <span className="text-[11px] font-semibold text-white">Remove</span>
                </button>
              </div>
            ))}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-dashed border-[var(--color-border)] text-[11px] font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-text)] hover:text-[var(--color-text)] disabled:opacity-50"
            >
              {uploading ? '…' : '+ Add'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
            />
          </div>
        )}
      </div>

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

      <div>
        <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">
          Best for <span className="font-normal">(one tag per line, e.g. Financial buyer)</span>
        </label>
        <textarea
          value={buyerTagsText}
          onChange={(e) => setBuyerTagsText(e.target.value)}
          placeholder={'Financial buyer\nStrategic buyer'}
          rows={3}
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

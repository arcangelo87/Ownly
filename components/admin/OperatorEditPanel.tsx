'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { updateListingContent, deleteListingPhoto, getListingPhotos, updateListingSector, generateTranslations } from '@/app/actions/admin';
import { createPhotoUploadUrl } from '@/app/actions/deals';
import { createClient } from '@/lib/supabase/client';
import { SECTOR_LABELS } from '@/lib/format';
import type { Listing } from '@/types';

interface Props {
  listing: Listing;
  onSave: (updated: Partial<Listing>) => void;
}

type LocaleKey = 'en' | 'it' | 'pt';

export function OperatorEditPanel({ listing, onSave }: Props) {
  const [activeLocale, setActiveLocale] = useState<LocaleKey>('en');

  const [title, setTitle] = useState(listing.title ?? '');
  const [about, setAbout] = useState(listing.about ?? '');
  const [highlightsText, setHighlightsText] = useState((listing.highlights ?? []).join('\n'));
  const [buyerTagsText, setBuyerTagsText] = useState((listing.buyer_tags ?? []).join('\n'));

  const [titleIt, setTitleIt] = useState(listing.title_it ?? '');
  const [aboutIt, setAboutIt] = useState(listing.about_it ?? '');
  const [highlightsItText, setHighlightsItText] = useState((listing.highlights_it ?? []).join('\n'));
  const [buyerTagsItText, setBuyerTagsItText] = useState((listing.buyer_tags_it ?? []).join('\n'));

  const [titlePt, setTitlePt] = useState(listing.title_pt ?? '');
  const [aboutPt, setAboutPt] = useState(listing.about_pt ?? '');
  const [highlightsPtText, setHighlightsPtText] = useState((listing.highlights_pt ?? []).join('\n'));
  const [buyerTagsPtText, setBuyerTagsPtText] = useState((listing.buyer_tags_pt ?? []).join('\n'));

  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const [sector, setSector] = useState(listing.sector ?? '');
  const [sectorSaving, setSectorSaving] = useState(false);

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

  async function handleSectorChange(value: string) {
    setSector(value);
    setSectorSaving(true);
    try {
      await updateListingSector(listing.id, value);
      onSave({ sector: value });
    } finally {
      setSectorSaving(false);
    }
  }

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

  function parseLines(text: string) {
    const arr = text.split('\n').map((s) => s.trim()).filter(Boolean);
    return arr.length > 0 ? arr : null;
  }

  async function handleGenerateTranslations() {
    setTranslating(true);
    setTranslateError(null);
    try {
      const result = await generateTranslations(listing.id);
      setTitleIt(result.title_it ?? '');
      setAboutIt(result.about_it ?? '');
      setHighlightsItText((result.highlights_it ?? []).join('\n'));
      setBuyerTagsItText((result.buyer_tags_it ?? []).join('\n'));
      setTitlePt(result.title_pt ?? '');
      setAboutPt(result.about_pt ?? '');
      setHighlightsPtText((result.highlights_pt ?? []).join('\n'));
      setBuyerTagsPtText((result.buyer_tags_pt ?? []).join('\n'));
      onSave(result);
    } catch (e) {
      setTranslateError(e instanceof Error ? e.message : 'Translation failed.');
    } finally {
      setTranslating(false);
    }
  }

  function handleSave() {
    const content = {
      title: title.trim() || null,
      about: about.trim() || null,
      highlights: parseLines(highlightsText),
      buyer_tags: parseLines(buyerTagsText),
      title_it: titleIt.trim() || null,
      about_it: aboutIt.trim() || null,
      highlights_it: parseLines(highlightsItText),
      buyer_tags_it: parseLines(buyerTagsItText),
      title_pt: titlePt.trim() || null,
      about_pt: aboutPt.trim() || null,
      highlights_pt: parseLines(highlightsPtText),
      buyer_tags_pt: parseLines(buyerTagsPtText),
    };

    startTransition(async () => {
      await updateListingContent(listing.id, content);
      onSave(content);
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
        <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">
          Sector {sectorSaving && <span className="font-normal normal-case tracking-normal">Saving…</span>}
        </label>
        <select
          value={sector}
          onChange={(e) => handleSectorChange(e.target.value)}
          disabled={sectorSaving}
          className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)] disabled:opacity-50"
        >
          <option value="" disabled>Select sector</option>
          {Object.entries(SECTOR_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

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

      {/* Locale tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)] pb-0">
        {(['en', 'it', 'pt'] as LocaleKey[]).map((loc) => (
          <button
            key={loc}
            onClick={() => setActiveLocale(loc)}
            className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors ${
              activeLocale === loc
                ? 'border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>

      {activeLocale === 'en' && (
        <>
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
              Best for <span className="font-normal">(one tag per line)</span>
            </label>
            <textarea
              value={buyerTagsText}
              onChange={(e) => setBuyerTagsText(e.target.value)}
              placeholder={'Financial buyer\nStrategic buyer'}
              rows={3}
              className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)] placeholder:text-[var(--color-muted)]"
            />
          </div>
        </>
      )}

      {activeLocale === 'it' && (
        <>
          {(title || about) && !titleIt && !aboutIt && (
            <div className="flex items-center justify-between rounded-md bg-amber-50 px-4 py-3">
              <p className="text-[12px] text-amber-700">Italian translation not yet generated.</p>
              <button
                onClick={handleGenerateTranslations}
                disabled={translating}
                className="ml-4 shrink-0 rounded-md bg-amber-600 px-3 py-1.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-[0.88] disabled:opacity-50"
              >
                {translating ? 'Generating…' : 'Generate translations'}
              </button>
            </div>
          )}
          {translateError && (
            <p className="text-[12px] text-red-600">{translateError}</p>
          )}
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">Titolo (IT)</label>
            <input
              value={titleIt}
              onChange={(e) => setTitleIt(e.target.value)}
              placeholder="Titolo dell'annuncio in italiano"
              className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">Descrizione (IT)</label>
            <textarea
              value={aboutIt}
              onChange={(e) => setAboutIt(e.target.value)}
              placeholder="Descrizione dell'azienda in italiano"
              rows={4}
              className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)] placeholder:text-[var(--color-muted)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">
              Highlights (IT) <span className="font-normal">(uno per riga)</span>
            </label>
            <textarea
              value={highlightsItText}
              onChange={(e) => setHighlightsItText(e.target.value)}
              placeholder={'20 anni di storia operativa\nContratti pluriennali con clienti corporate'}
              rows={5}
              className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)] placeholder:text-[var(--color-muted)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">
              Adatto a (IT) <span className="font-normal">(uno per riga)</span>
            </label>
            <textarea
              value={buyerTagsItText}
              onChange={(e) => setBuyerTagsItText(e.target.value)}
              placeholder={'Acquirente operativo\nAcquirente strategico'}
              rows={3}
              className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)] placeholder:text-[var(--color-muted)]"
            />
          </div>
        </>
      )}

      {activeLocale === 'pt' && (
        <>
          {(title || about) && !titlePt && !aboutPt && (
            <div className="flex items-center justify-between rounded-md bg-amber-50 px-4 py-3">
              <p className="text-[12px] text-amber-700">Portuguese translation not yet generated.</p>
              <button
                onClick={handleGenerateTranslations}
                disabled={translating}
                className="ml-4 shrink-0 rounded-md bg-amber-600 px-3 py-1.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-[0.88] disabled:opacity-50"
              >
                {translating ? 'Generating…' : 'Generate translations'}
              </button>
            </div>
          )}
          {translateError && (
            <p className="text-[12px] text-red-600">{translateError}</p>
          )}
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">Titulo (PT)</label>
            <input
              value={titlePt}
              onChange={(e) => setTitlePt(e.target.value)}
              placeholder="Titulo do anuncio em portugues"
              className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">Descricao (PT)</label>
            <textarea
              value={aboutPt}
              onChange={(e) => setAboutPt(e.target.value)}
              placeholder="Descricao da empresa em portugues"
              rows={4}
              className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)] placeholder:text-[var(--color-muted)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">
              Destaques (PT) <span className="font-normal">(um por linha)</span>
            </label>
            <textarea
              value={highlightsPtText}
              onChange={(e) => setHighlightsPtText(e.target.value)}
              placeholder={'20 anos de historia operacional\nContratos plurianuais com clientes corporate'}
              rows={5}
              className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)] placeholder:text-[var(--color-muted)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">
              Adequado para (PT) <span className="font-normal">(um por linha)</span>
            </label>
            <textarea
              value={buyerTagsPtText}
              onChange={(e) => setBuyerTagsPtText(e.target.value)}
              placeholder={'Comprador operacional\nComprador estrategico'}
              rows={3}
              className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)] placeholder:text-[var(--color-muted)]"
            />
          </div>
        </>
      )}

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

'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UploadCloud, X } from 'lucide-react';

const MAX_FILES = 10;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface PhotoUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function PhotoUpload({ files, onChange }: PhotoUploadProps) {
  const t = useTranslations('seller.step1.photos');
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function addFiles(incoming: File[]) {
    const valid = incoming.filter(
      (f) => f.type.startsWith('image/') && f.size <= MAX_SIZE_BYTES,
    );
    const slots = MAX_FILES - files.length;
    onChange([...files, ...valid.slice(0, slots)]);
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = '';
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label={t('dragText')}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={[
          'flex flex-col items-center gap-2 rounded-lg border-[1.5px] border-dashed px-6 py-8 text-center cursor-pointer transition-colors',
          dragging
            ? 'border-[var(--color-accent)] bg-[#EBF1ED]'
            : 'border-[var(--color-border)] bg-white hover:border-[var(--color-accent)] hover:bg-[#EBF1ED]',
        ].join(' ')}
      >
        <UploadCloud className="h-9 w-9 text-[var(--color-muted)]" />
        <p className="text-sm text-[var(--color-muted)]">
          {t('dragText').split(', or ')[0]}, or{' '}
          <span className="font-medium text-[var(--color-accent)]">
            click to browse
          </span>
        </p>
        <p className="text-xs text-[var(--color-muted)]">{t('dragLimit')}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleSelect}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-md overflow-hidden bg-[var(--color-surface)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                aria-label="Remove photo"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

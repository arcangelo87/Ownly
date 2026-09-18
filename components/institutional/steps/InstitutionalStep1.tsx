'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const SECTOR_VALUES = ['accounting', 'insurance', 'lending', 'other'] as const;
const TICKET_SIZE_VALUES = ['under_1m', '1m_3m', '3m_7m', '7m_15m', 'over_15m'] as const;
const CAPITAL_VALUES = ['yes', 'no', 'notSure'] as const;

export interface Step1Data {
  sectors: string[];
  sector_other: string;
  ticket_size: string;
  has_committed_capital: string;
}

interface InstitutionalStep1Props {
  onComplete: (data: Step1Data) => void;
}

export function InstitutionalStep1({ onComplete }: InstitutionalStep1Props) {
  const t = useTranslations('institutionalSearch.step1');

  const [sectors, setSectors] = useState<string[]>([]);
  const [otherSectorChecked, setOtherSectorChecked] = useState(false);
  const [sectorOther, setSectorOther] = useState('');
  const [ticketSize, setTicketSize] = useState('');
  const [hasCommittedCapital, setHasCommittedCapital] = useState('');
  const [errors, setErrors] = useState<{ sectors?: string; ticket_size?: string; has_committed_capital?: string }>({});

  function toggleSector(value: string) {
    setSectors((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
    if (errors.sectors) setErrors((prev) => ({ ...prev, sectors: undefined }));
  }

  function handleTicketSize(value: string) {
    setTicketSize(value);
    if (errors.ticket_size) setErrors((prev) => ({ ...prev, ticket_size: undefined }));
  }

  function handleCapital(value: string) {
    setHasCommittedCapital(value);
    if (errors.has_committed_capital) setErrors((prev) => ({ ...prev, has_committed_capital: undefined }));
  }

  function validate(): boolean {
    const next: { sectors?: string; ticket_size?: string; has_committed_capital?: string } = {};
    if (sectors.length === 0 && !otherSectorChecked) next.sectors = t('errors.sectorsRequired');
    if (!ticketSize) next.ticket_size = t('errors.ticketSizeRequired');
    if (!hasCommittedCapital) next.has_committed_capital = t('errors.capitalRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onComplete({
      sectors: [...sectors, ...(otherSectorChecked ? ['other'] : [])],
      sector_other: sectorOther,
      ticket_size: ticketSize,
      has_committed_capital: hasCommittedCapital,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

      {/* Sectors */}
      <Field label={t('sectors.label')} helper={t('sectors.helper')} error={errors.sectors}>
        <div className="grid grid-cols-2 gap-2">
          {SECTOR_VALUES.filter((v) => v !== 'other').map((key) => {
            const selected = sectors.includes(key);
            return (
              <CheckboxCard
                key={key}
                label={t(`sectors.${key}`)}
                checked={selected}
                hasError={!!errors.sectors}
                onChange={() => toggleSector(key)}
              />
            );
          })}
          <CheckboxCard
            label={t('sectors.other')}
            checked={otherSectorChecked}
            hasError={!!errors.sectors}
            onChange={() => setOtherSectorChecked((v) => !v)}
          />
        </div>
        {otherSectorChecked && (
          <Input
            type="text"
            value={sectorOther}
            onChange={(e) => setSectorOther(e.target.value)}
            placeholder={t('sectorOther.placeholder')}
            className="mt-2"
          />
        )}
      </Field>

      {/* Ticket size */}
      <Field label={t('ticketSize.label')} helper={t('ticketSize.helper')} error={errors.ticket_size}>
        <NativeSelect
          id="ticketSize"
          value={ticketSize}
          onChange={handleTicketSize}
          placeholder={t('ticketSize.placeholder')}
          hasError={!!errors.ticket_size}
          options={TICKET_SIZE_VALUES.map((v) => ({ value: v, label: t(`ticketSizeOptions.${v}`) }))}
        />
      </Field>

      {/* Committed capital */}
      <Field label={t('hasCommittedCapital.label')} error={errors.has_committed_capital}>
        <div className="flex flex-col gap-3">
          {CAPITAL_VALUES.map((key) => (
            <RadioCard
              key={key}
              label={t(`hasCommittedCapital.${key}`)}
              name="has_committed_capital"
              selected={hasCommittedCapital === key}
              hasError={!!errors.has_committed_capital}
              onChange={() => handleCapital(key)}
            />
          ))}
        </div>
      </Field>

      <div className="mt-4 flex justify-end border-t border-[var(--color-border)] pt-8">
        <Button type="submit">{t('continue')}</Button>
      </div>
    </form>
  );
}

function CheckboxCard({
  label,
  checked,
  hasError,
  onChange,
}: {
  label: string;
  checked: boolean;
  hasError?: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={[
        'flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors',
        checked
          ? 'border-[var(--color-accent)] bg-[#EBF1ED] text-[var(--color-text)]'
          : 'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-accent)]',
        hasError && !checked ? 'border-red-600' : '',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-[1.5px] transition-colors',
          checked ? 'border-[var(--color-accent)] bg-[var(--color-accent)]' : 'border-[var(--color-border)]',
        ].join(' ')}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}

function RadioCard({
  label,
  name,
  selected,
  hasError,
  onChange,
}: {
  label: string;
  name: string;
  selected: boolean;
  hasError: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={[
        'flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors',
        selected
          ? 'border-[var(--color-accent)] bg-[#EBF1ED] text-[var(--color-text)]'
          : 'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-accent)]',
        hasError && !selected ? 'border-red-600' : '',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors',
          selected ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)]',
        ].join(' ')}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />}
      </span>
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onChange}
        className="sr-only"
      />
      {label}
    </label>
  );
}

function Field({
  label,
  helper,
  error,
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : helper ? (
        <p className="text-xs leading-[1.5] text-[var(--color-muted)]">{helper}</p>
      ) : null}
    </div>
  );
}

function NativeSelect({
  id,
  value,
  onChange,
  placeholder,
  options,
  hasError,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  hasError?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'w-full appearance-none rounded-md border bg-white pl-3 pr-8 py-[10px] text-sm outline-none transition-colors',
          hasError
            ? 'border-red-600'
            : 'border-[var(--color-border)] focus:border-[var(--color-text)]',
          !value ? 'text-[var(--color-muted)]' : 'text-[var(--color-text)]',
        ].join(' ')}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

'use client';

import { useRef, useState, useTransition } from 'react';
import { ingestListingWithAI, ingestListingManual } from '@/app/actions/admin';
import { SECTOR_LABELS } from '@/lib/format';

type Mode = 'ai' | 'manual';
type AiInputMode = 'url' | 'text';

type Result = { id: string; slug: string; title?: string | null };
type BatchEntry = { url: string; status: 'ok' | 'error'; slug?: string; title?: string | null; message?: string };

export function IngestPanel() {
  const [mode, setMode] = useState<Mode>('ai');
  const [aiInputMode, setAiInputMode] = useState<AiInputMode>('url');
  const [aiInput, setAiInput] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Batch state (URL mode only)
  const [running, setRunning] = useState(false);
  const [batchLog, setBatchLog] = useState<BatchEntry[]>([]);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual form state
  const [manual, setManual] = useState({
    business_name: '', country: '', region: '', sector: '', year_founded: '',
    revenue_range: '', ebitda_margin: '', employee_count: '', owner_involvement: '',
    asking_price: '', partial_sale: '', timeline: '', business_description: '',
  });

  function reset() {
    setResult(null); setError(null); setAiInput('');
    setManual({ business_name: '', country: '', region: '', sector: '', year_founded: '', revenue_range: '', ebitda_margin: '', employee_count: '', owner_involvement: '', asking_price: '', partial_sale: '', timeline: '', business_description: '' });
  }

  function parseUrls(raw: string): string[] {
    return raw.split('\n').map((s) => s.trim()).filter((s) => s.startsWith('http'));
  }

  function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const urls = text
        .split('\n')
        .map((line) => line.split(',')[0].trim())
        .filter((val) => val.startsWith('http'));
      setAiInput((prev) => {
        const existing = prev.trim();
        return existing ? `${existing}\n${urls.join('\n')}` : urls.join('\n');
      });
    };
    reader.readAsText(file);
    // Reset so same file can be re-uploaded
    e.target.value = '';
  }

  async function handleAiSubmit() {
    setError(null);
    setResult(null);

    if (aiInputMode === 'url') {
      const urls = parseUrls(aiInput);
      if (urls.length === 0) { setError('No valid URLs found. Add one URL per line.'); return; }

      if (urls.length === 1) {
        // Single URL — use existing transition path for cleaner success state
        startTransition(async () => {
          try {
            const res = await ingestListingWithAI({ mode: 'url', url: urls[0] });
            setResult(res);
            setAiInput('');
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Something went wrong.');
          }
        });
        return;
      }

      // Multiple URLs — sequential batch
      setRunning(true);
      setBatchLog([]);
      setProgress({ current: 0, total: urls.length });

      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        setProgress({ current: i + 1, total: urls.length });
        try {
          const res = await ingestListingWithAI({ mode: 'url', url });
          setBatchLog((prev) => [...prev, { url, status: 'ok', slug: res.slug, title: res.title }]);
        } catch (e) {
          setBatchLog((prev) => [...prev, { url, status: 'error', message: e instanceof Error ? e.message : 'Unknown error' }]);
        }
      }

      setRunning(false);
      setProgress(null);
      setAiInput('');
      return;
    }

    // Text mode — single call
    startTransition(async () => {
      try {
        const res = await ingestListingWithAI({ mode: 'text', text: aiInput.trim() });
        setResult(res);
        setAiInput('');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong.');
      }
    });
  }

  function handleManualSubmit() {
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const res = await ingestListingManual(manual);
        setResult(res);
        reset();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong.');
      }
    });
  }

  const isBusy = pending || running;
  const batchDone = !running && batchLog.length > 0;
  const batchOk = batchLog.filter((e) => e.status === 'ok').length;
  const batchFail = batchLog.filter((e) => e.status === 'error').length;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white">
      {/* Header + mode tabs */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">Add listing</p>
        <div className="flex gap-1">
          {(['ai', 'manual'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); setResult(null); }}
              className={`rounded px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors ${
                mode === m
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {m === 'ai' ? 'AI ingest' : 'Manual'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Single-result success state */}
        {result && (
          <div className="flex items-center justify-between rounded-md bg-[#EBF1ED] px-4 py-3">
            <div>
              <p className="text-[12px] font-semibold text-[var(--color-accent)]">Draft created</p>
              {result.title && <p className="mt-0.5 text-[12px] text-[var(--color-accent)]">{result.title}</p>}
              <p className="mt-0.5 font-mono text-[11px] text-[var(--color-accent)] opacity-70">{result.slug}</p>
            </div>
            <button onClick={reset} className="text-[11px] font-semibold text-[var(--color-accent)] underline underline-offset-2 hover:opacity-70">
              Add another
            </button>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3">
            <p className="text-[12px] text-red-700">{error}</p>
          </div>
        )}

        {/* AI ingest form */}
        {!result && mode === 'ai' && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {(['url', 'text'] as AiInputMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setAiInputMode(m); setBatchLog([]); setProgress(null); }}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                    aiInputMode === m
                      ? 'bg-[var(--color-surface)] text-[var(--color-text)]'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {m === 'url' ? 'From URL' : 'Paste text'}
                </button>
              ))}
            </div>

            {aiInputMode === 'url' ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder={"https://example.com/listing-one\nhttps://example.com/listing-two"}
                  rows={3}
                  disabled={isBusy}
                  className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-2 font-mono text-[12px] outline-none focus:border-[var(--color-text)] disabled:opacity-50 placeholder:text-[var(--color-muted)] placeholder:font-sans"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isBusy}
                    className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-semibold text-[var(--color-muted)] transition-colors hover:border-[var(--color-text)] hover:text-[var(--color-text)] disabled:opacity-40"
                  >
                    Upload CSV
                  </button>
                  <span className="text-[11px] text-[var(--color-muted)]">First column must be URLs</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={handleCsvUpload}
                  />
                </div>
              </div>
            ) : (
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Paste any description, listing text, or broker summary here..."
                rows={5}
                disabled={isBusy}
                className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)] disabled:opacity-50 placeholder:text-[var(--color-muted)]"
              />
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleAiSubmit}
                disabled={isBusy || !aiInput.trim()}
                className="rounded-md bg-[var(--color-accent)] px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-[0.88] disabled:opacity-40"
              >
                {running ? 'Processing…' : pending ? 'Claude is extracting…' : 'Extract with AI'}
              </button>
              {(pending || running) && (
                <span className="text-[11px] text-[var(--color-muted)]">
                  {running && progress
                    ? `Processing ${progress.current} of ${progress.total}…`
                    : 'This takes 10–20 seconds'}
                </span>
              )}
            </div>

            {/* Batch log */}
            {(running || batchDone) && (
              <div className="mt-1 flex flex-col gap-1">
                {/* Progress bar */}
                {running && progress && (
                  <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-surface)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-accent)] transition-all"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                )}

                {/* Per-URL rows */}
                <div className="flex flex-col gap-0.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
                  {batchLog.map((entry, i) => (
                    <div key={i} className="flex items-baseline gap-1.5 font-mono text-[11px]">
                      {entry.status === 'ok' ? (
                        <>
                          <span className="text-[var(--color-accent)]">✓</span>
                          <span className="text-[var(--color-accent)] opacity-80">{entry.slug}</span>
                          {entry.title && <span className="truncate text-[var(--color-muted)]">{entry.title}</span>}
                        </>
                      ) : (
                        <>
                          <span className="text-red-500">✗</span>
                          <span className="truncate text-[var(--color-muted)]">{entry.url}</span>
                          <span className="text-red-500">{entry.message}</span>
                        </>
                      )}
                    </div>
                  ))}
                  {running && progress && (
                    <div className="font-mono text-[11px] text-[var(--color-muted)] opacity-60">
                      {progress.current < progress.total ? 'Fetching next…' : ''}
                    </div>
                  )}
                </div>

                {/* Summary + clear */}
                {batchDone && (
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-[var(--color-muted)]">
                      {batchLog.length} processed — {batchOk} succeeded{batchFail > 0 ? `, ${batchFail} failed` : ''}
                    </p>
                    <button
                      onClick={() => setBatchLog([])}
                      className="text-[11px] text-[var(--color-muted)] underline underline-offset-2 hover:opacity-70"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Manual ingest form */}
        {!result && mode === 'manual' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <Field label="Business name">
                <input value={manual.business_name} onChange={(e) => setManual((p) => ({ ...p, business_name: e.target.value }))} placeholder="e.g. Trattoria Roma" className={inputCls} />
              </Field>
              <Field label="Country">
                <select value={manual.country} onChange={(e) => setManual((p) => ({ ...p, country: e.target.value }))} className={inputCls}>
                  <option value="">Select</option>
                  <option value="IT">Italy</option>
                  <option value="PT">Portugal</option>
                </select>
              </Field>
              <Field label="Region">
                <input value={manual.region} onChange={(e) => setManual((p) => ({ ...p, region: e.target.value }))} placeholder="e.g. Toscana" className={inputCls} />
              </Field>
              <Field label="Sector">
                <select value={manual.sector} onChange={(e) => setManual((p) => ({ ...p, sector: e.target.value }))} className={inputCls}>
                  <option value="">Select</option>
                  {Object.entries(SECTOR_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </Field>
              <Field label="Year founded">
                <input value={manual.year_founded} onChange={(e) => setManual((p) => ({ ...p, year_founded: e.target.value }))} placeholder="e.g. 2008" className={inputCls} />
              </Field>
              <Field label="Revenue range">
                <select value={manual.revenue_range} onChange={(e) => setManual((p) => ({ ...p, revenue_range: e.target.value }))} className={inputCls}>
                  <option value="">Select</option>
                  <option value="under_500k">&lt;€500k</option>
                  <option value="500k_1m">€500k–1M</option>
                  <option value="1m_2_5m">€1–2.5M</option>
                  <option value="2_5m_5m">€2.5–5M</option>
                  <option value="over_5m">&gt;€5M</option>
                </select>
              </Field>
              <Field label="EBITDA margin">
                <select value={manual.ebitda_margin} onChange={(e) => setManual((p) => ({ ...p, ebitda_margin: e.target.value }))} className={inputCls}>
                  <option value="">Select</option>
                  <option value="below_10">&lt;10%</option>
                  <option value="10_20">10–20%</option>
                  <option value="20_35">20–35%</option>
                  <option value="above_35">&gt;35%</option>
                  <option value="not_sure">Not sure</option>
                </select>
              </Field>
              <Field label="Employees">
                <select value={manual.employee_count} onChange={(e) => setManual((p) => ({ ...p, employee_count: e.target.value }))} className={inputCls}>
                  <option value="">Select</option>
                  <option value="just_me">Just me</option>
                  <option value="2_5">2–5</option>
                  <option value="6_15">6–15</option>
                  <option value="16_30">16–30</option>
                  <option value="30_plus">30+</option>
                </select>
              </Field>
              <Field label="Owner involvement">
                <select value={manual.owner_involvement} onChange={(e) => setManual((p) => ({ ...p, owner_involvement: e.target.value }))} className={inputCls}>
                  <option value="">Select</option>
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="advisory">Advisory</option>
                  <option value="minimal">Minimal</option>
                </select>
              </Field>
              <Field label="Asking price">
                <select value={manual.asking_price} onChange={(e) => setManual((p) => ({ ...p, asking_price: e.target.value }))} className={inputCls}>
                  <option value="">Select</option>
                  <option value="under_500k">&lt;€500k</option>
                  <option value="500k_1m">€500k–1M</option>
                  <option value="1m_2_5m">€1–2.5M</option>
                  <option value="2_5m_5m">€2.5–5M</option>
                  <option value="5m_10m">€5–10M</option>
                  <option value="over_10m">&gt;€10M</option>
                </select>
              </Field>
              <Field label="Sale structure">
                <select value={manual.partial_sale} onChange={(e) => setManual((p) => ({ ...p, partial_sale: e.target.value }))} className={inputCls}>
                  <option value="">Select</option>
                  <option value="full_sale_only">Full sale only</option>
                  <option value="open_to_minority">Open to partial</option>
                </select>
              </Field>
              <Field label="Timeline">
                <select value={manual.timeline} onChange={(e) => setManual((p) => ({ ...p, timeline: e.target.value }))} className={inputCls}>
                  <option value="">Select</option>
                  <option value="ready_now">Ready now</option>
                  <option value="6_12_months">6–12 months</option>
                  <option value="1_2_years">1–2 years</option>
                  <option value="exploring">Just exploring</option>
                </select>
              </Field>
            </div>

            <Field label="Business description">
              <textarea
                value={manual.business_description}
                onChange={(e) => setManual((p) => ({ ...p, business_description: e.target.value }))}
                placeholder="Brief description of the business — you can flesh this out later in the edit panel"
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </Field>

            <button
              onClick={handleManualSubmit}
              disabled={pending || !manual.business_name.trim()}
              className="self-start rounded-md bg-[var(--color-accent)] px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-[0.88] disabled:opacity-40"
            >
              {pending ? 'Creating…' : 'Create draft'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls = 'w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-text)]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold text-[var(--color-muted)]">{label}</label>
      {children}
    </div>
  );
}

'use client';

import { useEffect, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateListingStatus } from '@/app/actions/admin';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  live: 'Live',
  rejected: 'Rejected',
};

const STATUS_COLORS: Record<string, string> = {
  draft:     'bg-[var(--color-surface)] text-[var(--color-muted)]',
  in_review: 'bg-amber-100 text-amber-800',
  live:      'bg-[#EBF1ED] text-[var(--color-accent)]',
  rejected:  'bg-red-50 text-red-700',
};

type Listing = {
  id: string;
  created_at: string;
  status: string;
  business_name: string | null;
  country: string | null;
  region: string | null;
  sector: string | null;
  revenue_range: string | null;
  employee_count: string | null;
};

export function ListingsTable({ initialListings }: { initialListings: Listing[] }) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('listings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'listings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setListings((prev) => [payload.new as Listing, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setListings((prev) =>
              prev.map((l) => (l.id === payload.new.id ? { ...l, ...payload.new } : l)),
            );
          }
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  function handleStatusChange(id: string, status: string) {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    startTransition(async () => {
      await updateListingStatus(id, status as 'draft' | 'in_review' | 'live' | 'rejected');
    });
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-white px-8 py-16 text-center">
        <p className="text-sm text-[var(--color-muted)]">No listings yet. They'll appear here in real time.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            {['Business', 'Location', 'Sector', 'Revenue', 'FTE', 'Status', 'Submitted'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-muted)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)] bg-white">
          {listings.map((listing) => (
            <tr key={listing.id} className="hover:bg-[var(--color-bg)]">
              <td className="px-4 py-3 font-medium text-[var(--color-text)]">
                {listing.business_name ?? <span className="text-[var(--color-muted)]">Anonymous</span>}
              </td>
              <td className="px-4 py-3 text-[var(--color-muted)]">
                {[listing.country, listing.region].filter(Boolean).join(', ') || '—'}
              </td>
              <td className="px-4 py-3 text-[var(--color-muted)] capitalize">
                {listing.sector?.replace(/_/g, ' ') ?? '—'}
              </td>
              <td className="px-4 py-3 text-[var(--color-muted)]">
                {formatRevenue(listing.revenue_range)}
              </td>
              <td className="px-4 py-3 text-[var(--color-muted)]">
                {formatEmployees(listing.employee_count)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_COLORS[listing.status] ?? STATUS_COLORS.draft}`}>
                    {STATUS_LABELS[listing.status] ?? listing.status}
                  </span>
                  <select
                    value={listing.status}
                    onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                    disabled={pending}
                    className="rounded border border-[var(--color-border)] bg-white px-2 py-0.5 text-[11px] outline-none focus:border-[var(--color-text)] disabled:opacity-50"
                  >
                    {Object.entries(STATUS_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
              </td>
              <td className="px-4 py-3 text-[var(--color-muted)]">
                {new Date(listing.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatRevenue(val: string | null): string {
  const map: Record<string, string> = {
    under_500k: '<€500k', '500k_1m': '€500k–1M', '1m_2_5m': '€1–2.5M',
    '2_5m_5m': '€2.5–5M', over_5m: '>€5M',
  };
  return val ? (map[val] ?? val) : '—';
}

function formatEmployees(val: string | null): string {
  const map: Record<string, string> = {
    just_me: 'Just me', '2_5': '2–5', '6_15': '6–15', '16_30': '16–30', '30_plus': '30+',
  };
  return val ? (map[val] ?? val) : '—';
}

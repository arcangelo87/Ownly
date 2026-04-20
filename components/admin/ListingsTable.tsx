'use client';

import { useEffect, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateListingStatus } from '@/app/actions/admin';
import { publishListing } from '@/app/actions/deals';
import { OperatorEditPanel } from '@/components/admin/OperatorEditPanel';
import {
  SECTOR_LABELS,
  formatRevenue,
  formatEmployees,
  formatEbitda,
  formatPrice,
  formatPartialSale,
  formatTimeline,
  formatReasons,
} from '@/lib/format';
import type { Listing } from '@/types';

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


export function ListingsTable({ initialListings }: { initialListings: Listing[] }) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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
    const typed = status as Listing['status'];
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: typed } : l)));
    startTransition(async () => {
      if (typed === 'live') {
        const slug = await publishListing(id);
        setListings((prev) => prev.map((l) => (l.id === id ? { ...l, slug } : l)));
      } else {
        await updateListingStatus(id, typed);
      }
    });
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-white px-8 py-16 text-center">
        <p className="text-sm text-[var(--color-muted)]">No listings yet. They'll appear here in real time.</p>
      </div>
    );
  }

  const expandedListing = listings.find((l) => l.id === expandedId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      {expandedListing && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-6">
          <OperatorEditPanel
            listing={expandedListing}
            onSave={(updated) =>
              setListings((prev) =>
                prev.map((l) => (l.id === expandedListing.id ? { ...l, ...updated } : l)),
              )
            }
          />
        </div>
      )}
      <div className="rounded-lg border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            {['Business', 'Contact', 'Location', 'Sector', 'Revenue', 'FTE', 'Status', 'Submitted'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-muted)]">
                {h}
              </th>
            ))}
            <th className="w-8" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)] bg-white">
          {listings.map((listing) => {
            const isExpanded = expandedId === listing.id;
            return (
              <>
                <tr
                  key={listing.id}
                  className="cursor-pointer hover:bg-[var(--color-bg)]"
                  onClick={() => setExpandedId(isExpanded ? null : listing.id)}
                >
                  <td className="px-4 py-3 font-medium text-[var(--color-text)]">
                    {listing.business_name ?? <span className="text-[var(--color-muted)]">Anonymous</span>}
                  </td>
                  <td className="px-4 py-3">
                    {listing.seller_email ? (
                      <div className="flex flex-col gap-0.5">
                        <a
                          href={`mailto:${listing.seller_email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[var(--color-accent)] hover:underline"
                        >
                          {listing.seller_email}
                        </a>
                        {listing.seller_phone && (
                          <span className="text-[11px] text-[var(--color-muted)]">{listing.seller_phone}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[var(--color-muted)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">
                    {[listing.country, listing.region].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">
                    {listing.sector ? (SECTOR_LABELS[listing.sector] ?? listing.sector) : '—'}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">
                    {formatRevenue(listing.revenue_range)}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">
                    {formatEmployees(listing.employee_count)}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
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
                  <td className="px-4 py-3 text-[var(--color-muted)]">
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </td>
                </tr>

                {isExpanded && (
                  <tr key={`${listing.id}-detail`} className="bg-[var(--color-bg)]">
                    <td colSpan={9} className="px-6 py-5">
                      <div className="grid grid-cols-2 gap-x-10 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
                        <DetailField label="Year Founded" value={listing.year_founded?.toString()} />
                        <DetailField label="Email" value={listing.seller_email} link={listing.seller_email ? `mailto:${listing.seller_email}` : undefined} />
                        <DetailField label="Phone" value={listing.seller_phone} />
                        <DetailField label="EBITDA Margin" value={formatEbitda(listing.ebitda_margin)} />
                        <DetailField label="Asking Price" value={formatPrice(listing.asking_price)} />
                        <DetailField label="Partial Sale" value={formatPartialSale(listing.partial_sale)} />
                        <DetailField label="Timeline" value={formatTimeline(listing.timeline)} />
                        <DetailField label="Reasons for Sale" value={formatReasons(listing.reasons_for_sale)} />
                      </div>
                      {listing.business_description && (
                        <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                          <DetailBlock label="Business Description" value={listing.business_description} />
                        </div>
                      )}
                      {(listing.strongest_point || listing.buyer_disclosure) && (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          {listing.strongest_point && (
                            <DetailBlock label="Strongest Point" value={listing.strongest_point} />
                          )}
                          {listing.buyer_disclosure && (
                            <DetailBlock label="Buyer Disclosure" value={listing.buyer_disclosure} />
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function DetailField({ label, value, link }: { label: string; value: string | null | undefined; link?: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--color-muted)]">{label}</p>
      {link && value ? (
        <a href={link} className="mt-0.5 block text-sm text-[var(--color-accent)] hover:underline">{value}</a>
      ) : (
        <p className="mt-0.5 text-sm text-[var(--color-text)]">{value || '—'}</p>
      )}
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--color-muted)]">{label}</p>
      <p className="text-sm leading-relaxed text-[var(--color-text)]">{value}</p>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { BuyerSearchForm } from '@/components/buyer/BuyerSearchForm';

export function HeroBuyerCTA() {
  const t = useTranslations('home.buyers.hero');
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center px-9 py-5 border border-[var(--color-text)] text-[16px] font-medium rounded-[4px] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
      >
        {t('ctaSearch')}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto"
          aria-describedby={undefined}
        >
          <div className="[&>div]:min-h-0">
            <BuyerSearchForm onComplete={() => setOpen(false)} modal />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

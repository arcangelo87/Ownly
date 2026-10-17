-- Seed: 3 draft listings — accounting, insurance, and mortgage brokerage (Portugal)
-- Run in the Supabase dashboard SQL editor.
-- All listings are inserted with status = 'draft' for manual review and publish via the admin panel.

INSERT INTO listings (
  status, title, about, highlights,
  country, region, sector, year_founded,
  revenue_range, ebitda_margin, employee_count, owner_involvement,
  asking_price, partial_sale, timeline, reasons_for_sale
) VALUES

-- Listing: Accounting & Tax Practice | Lisboa, PT
(
  'draft',
  'Accounting & Tax Practice',
  'An established accounting and tax advisory practice based in central Lisbon, serving a diversified base of small and mid-sized businesses across retail, hospitality, and professional services. The firm handles bookkeeping, corporate tax filing, payroll processing, and IVA compliance for roughly 140 active clients, most on recurring monthly or annual retainers. A team of six, including four qualified accountants (contabilistas certificados), delivers the work under the founder''s supervision. Client relationships average over eight years in tenure, and referrals from existing clients and two partner law firms account for the majority of new business. The founder is looking to step back from day-to-day management while remaining available for a structured handover.',
  ARRAY[
    '140 active clients on recurring monthly and annual retainers, highly predictable revenue',
    'Team of six, including four certified accountants, capable of running independently of the founder',
    'Average client tenure of 8+ years, low churn and strong retention',
    'Established referral relationships with two Lisbon law firms',
    'Founder available for a structured transition to introduce clients and staff'
  ],
  'PT', 'Lisboa', 'professional_services', 2009,
  '500k_1m', '20_35', '6_15', 'full_time',
  '500k_1m', 'open_to_minority', '6_12_months', ARRAY['retirement']
),

-- Listing: Insurance Brokerage | Porto, PT
(
  'draft',
  'Insurance Brokerage',
  'An independent insurance brokerage operating across the Greater Porto area, placing personal and commercial lines on behalf of a diversified client base. The brokerage holds active agency agreements with six major Portuguese and European insurers, covering auto, home, health, and small business liability products. Roughly 65% of premium volume renews automatically each year, supported by a dedicated client services team of three who manage renewals, claims support, and policy adjustments. The business has grown steadily through local business networking and a modest but effective referral program. The founder, who built the brokerage from a single-person operation, is seeking a buyer to take on the next phase of growth.',
  ARRAY[
    'Active agency agreements with six major insurers across auto, home, health, and commercial lines',
    '65% automatic policy renewal rate, recurring commission base',
    'Dedicated client services team of three handling renewals and claims support',
    'Diversified book across personal and commercial lines reduces concentration risk',
    'Clear growth path through expansion of the commercial liability product line'
  ],
  'PT', 'Norte', 'professional_services', 2013,
  '500k_1m', '10_20', '2_5', 'full_time',
  '500k_1m', 'full_sale_only', '6_12_months', ARRAY['growth_capital']
),

-- Listing: Mortgage & Credit Brokerage | Algarve, PT
(
  'draft',
  'Mortgage & Credit Brokerage',
  'A mortgage and credit brokerage based in the Algarve, specialising in financing for international buyers purchasing residential property in Portugal. The business works with a panel of nine Portuguese banks to secure mortgage approval for foreign nationals, a segment that requires specialist knowledge of non-resident lending criteria and typically commands stronger broker commissions than domestic lending. English is the primary working language, and the team of four includes native speakers of English, French, and Dutch to match the client base. Leads arrive primarily through referral partnerships with real estate agencies and relocation consultants across the Algarve coast. The founder is relocating abroad and is seeking a full sale.',
  ARRAY[
    'Specialist focus on non-resident mortgage financing, higher commissions than standard domestic lending',
    'Panel agreements with nine Portuguese banks covering the non-resident lending market',
    'Multilingual team of four (English, French, Dutch) matched to an international client base',
    'Referral partnerships with Algarve real estate agencies and relocation consultants drive consistent lead flow',
    'Growing demand from foreign buyers continues to expand the addressable market'
  ],
  'PT', 'Algarve', 'professional_services', 2016,
  'under_500k', '20_35', '2_5', 'full_time',
  'under_500k', 'full_sale_only', 'ready_now', ARRAY['health_personal']
);

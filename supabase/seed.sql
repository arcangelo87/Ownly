-- Seed: 12 draft listings (3–14)
-- Run in the Supabase dashboard SQL editor.
-- All listings are inserted with status = 'draft' for manual review and publish via the admin panel.
-- Note: asking_price for Listing 6 uses '2_5m_5m' (closest bucket for "Above €2.5M").
-- Note: asking_price for Listing 10 uses 'under_500k' (closest bucket for "Under €100k").

INSERT INTO listings (
  status, title, about, highlights,
  country, region, sector, year_founded,
  revenue_range, ebitda_margin, employee_count, owner_involvement,
  asking_price, partial_sale, timeline, reasons_for_sale
) VALUES

-- Listing 3: Car Rental Business | Veneto, IT
(
  'draft',
  'Car Rental Business',
  'An independent car rental business operating near Venice, serving leisure travellers and local business clients from a single location. The fleet comprises approximately 40 vehicles across economy and mid-range segments, maintained on a rolling replacement cycle. Corporate accounts — including several regional businesses on annual contracts — represent roughly 30% of revenue and provide a stable year-round base. The leisure segment performs strongly in spring and summer, driven by Venice proximity and regional tourism. The founder is retiring after nearly two decades; the operations manager is in place and willing to continue under new ownership.',
  ARRAY[
    'Established independent operator with nearly 20 years of trading history near Venice',
    'Corporate accounts provide 30% of revenue — stable, year-round base',
    'Experienced operations manager in place and willing to continue',
    'Venice proximity drives consistent leisure demand with strong seasonal peaks',
    'Fleet included in the sale — no day-one capital expenditure required'
  ],
  'IT', 'Veneto', 'automotive_transport', 2004,
  '500k_1m', 'below_10', '6_15', 'advisory',
  '500k_1m', 'full_sale_only', '6_12_months', ARRAY['retirement']
),

-- Listing 4: Heritage Glove Atelier | Lisbon, PT
(
  'draft',
  'Heritage Glove Atelier',
  'One of Lisbon''s last remaining heritage glove ateliers, operating from the same Chiado address since 1962. The business hand-crafts leather gloves using traditional Portuguese techniques, selling through its boutique and a growing direct-to-consumer online channel that now accounts for 30% of revenue. Revenue is modest but margins are exceptional — the craft commands a premium that reflects its rarity. The brand has been featured in international press and counts luxury hotels among its wholesale clients. The current owner — second generation — has run the atelier for 28 years and is approaching retirement.',
  ARRAY[
    '60+ year brand with genuine heritage and international press recognition',
    'Exceptional margins driven by premium craft pricing and low raw material costs',
    'Growing DTC online channel — 30% of revenue and rising',
    'Wholesale relationships with Lisbon and Porto luxury hotels and concept stores',
    'Irreplaceable Chiado address with long-term lease in place'
  ],
  'PT', 'Lisboa', 'retail_artisan', 1962,
  'under_500k', 'above_35', '2_5', 'full_time',
  'under_500k', 'open_to_minority', '1_2_years', ARRAY['retirement']
),

-- Listing 5: Artisan Chair Manufacturer | Lombardia, IT
(
  'draft',
  'Artisan Chair Manufacturer',
  'A specialist furniture manufacturer based in the Brianza district of Lombardia, designing and producing upholstered chairs and dining furniture for the contract hospitality market. Clients include boutique hotel groups and high-end restaurants across northern Italy, with some export into Switzerland. Production is small-batch and fully custom — no mass volume — which supports strong margins and a differentiated market position. The founder, a trained cabinet maker, established the business in 1991 and has no family successor. He is prepared to remain for a transition period to hand over client and supplier relationships.',
  ARRAY[
    'Brianza-based — embedded in Italy''s furniture manufacturing ecosystem with strong supplier access',
    'Contract hospitality client base including boutique hotels and high-end restaurants',
    'Custom small-batch model supports premium pricing and healthy margins',
    'Export sales to Switzerland add geographic diversification',
    'Founder available for a 6-month transition to transfer client and supplier relationships'
  ],
  'IT', 'Lombardia', 'manufacturing', 1991,
  '500k_1m', '20_35', '6_15', 'full_time',
  '500k_1m', 'full_sale_only', '6_12_months', ARRAY['no_succession']
),

-- Listing 6: Agriturismo with Vineyard | Toscana, IT
(
  'draft',
  'Agriturismo with Vineyard',
  'A family-run agriturismo in the Tuscan hills, comprising eight guest rooms, a working vineyard of six hectares, an olive grove, and a dining room serving guests and private events. The property has operated for over 25 years and benefits from a consistent international guest base — primarily German, Dutch, and British visitors — with direct bookings representing over 60% of reservations. Wine and olive oil production are sold on-site and through a small mailing list. The asking price reflects the combined value of the operating business and the underlying real estate, sold as a single going concern including all land, buildings, equipment, and the agriturismo license.',
  ARRAY[
    'Sale includes land, buildings, vineyard, olive grove, and all equipment — full property acquisition',
    '60%+ direct bookings — low OTA dependency and strong margin retention',
    'Eight guest rooms plus private event and dining revenue stream',
    'Established international guest base with a high rate of repeat visitors',
    'Agriturismo license included — a meaningful regulatory barrier for new entrants'
  ],
  'IT', 'Toscana', 'hospitality_tourism', 1998,
  '1m_2_5m', '20_35', '2_5', 'full_time',
  '2_5m_5m', 'full_sale_only', '6_12_months', ARRAY['retirement']
),

-- Listing 7: Co-working Space | Lisbon, PT
(
  'draft',
  'Co-working Space',
  'A modern co-working facility occupying 600sqm across two floors in a central Lisbon neighbourhood. The space offers hot desks, dedicated desks, and eight private offices on rolling monthly contracts. Occupancy has stabilised at 78% over the past 18 months. The member base skews toward freelancers, remote workers, and small startups — many of them international, reflecting Lisbon''s growing digital nomad community. The founder is looking for a buyer or growth partner to expand to a second location, which she does not have the capital to pursue alone.',
  ARRAY[
    '78% occupancy across hot desks, dedicated desks, and private offices',
    'Rolling monthly contracts provide predictable recurring revenue',
    'Strong international member base — aligned with Lisbon''s digital nomad growth trend',
    'Central location with a long lease in place at below-market rent',
    'Documented waitlist demand for a second location — clear expansion path'
  ],
  'PT', 'Lisboa', 'professional_services', 2018,
  '500k_1m', '10_20', '2_5', 'advisory',
  '500k_1m', 'full_sale_only', '6_12_months', ARRAY['growth_capital']
),

-- Listing 8: Car Repair Workshop | Rome, IT
(
  'draft',
  'Car Repair Workshop',
  'A well-established independent car repair and servicing workshop operating in a residential area of Rome for over two decades. The business handles general servicing, diagnostics, bodywork, and MOT preparation across a broad range of makes. Revenue comes from a loyal base of private clients alongside four fleet maintenance contracts with local logistics companies — the fleet contracts represent roughly 30% of turnover and provide a stable recurring base. The workshop occupies a 400sqm ground-floor premises on a long-term lease. The founder-mechanic is retiring after 23 years; two experienced technicians plan to remain under new ownership.',
  ARRAY[
    '23-year operating history with a loyal private client base in a stable residential catchment',
    'Fleet maintenance contracts represent 30% of revenue — recurring and predictable',
    'Two experienced technicians staying on — not operationally dependent on the founder',
    '400sqm workshop on a long-term lease with renewal option',
    'Fully equipped — no major capital expenditure required for a new owner'
  ],
  'IT', 'Lazio', 'automotive_transport', 2001,
  '500k_1m', '10_20', '6_15', 'advisory',
  '500k_1m', 'full_sale_only', '6_12_months', ARRAY['retirement']
),

-- Listing 9: Beach Bar & Restaurant | Alentejo, PT
(
  'draft',
  'Beach Bar & Restaurant',
  'A beachside bar and restaurant on the Alentejo coast, operating from a licensed permanent structure on a Blue Flag beach. The business runs a food and drinks service from May to October, with a focused menu of fresh fish and simple Portuguese dishes that keeps kitchen operations lean and margins strong during peak months. The location benefits from growing domestic and international tourism to the Alentejo coast, increasingly sought as an alternative to the Algarve. The owner has run the business for over a decade and is looking to step back. The beach concession license is included in the sale.',
  ARRAY[
    'Permanent licensed structure on a Blue Flag beach — beach concession included',
    'Focused seasonal model keeps year-round fixed costs very low',
    'Simple, tight menu drives strong margins during the peak summer months',
    'Growing Alentejo coast profile among both domestic and international visitors',
    'Clear upside in extending the season or introducing a standalone sunset drinks service'
  ],
  'PT', 'Alentejo', 'food_beverage', 2010,
  'under_500k', '20_35', '2_5', 'full_time',
  'under_500k', 'full_sale_only', 'ready_now', ARRAY['no_succession']
),

-- Listing 10: Garden Design & Maintenance | Emilia-Romagna, IT
(
  'draft',
  'Garden Design & Maintenance',
  'A sole-trader garden maintenance and design business built over 15 years by its founder-operator in the Emilia-Romagna region. The business serves a stable base of private residential clients on recurring annual maintenance contracts, with occasional design and landscaping projects. Revenue is modest and the work is labour-intensive — margins are thin, but the client base is loyal and consistently renewed. The founder is stepping back to pursue a new venture and is looking for an individual buyer — ideally a gardener or landscape professional — to take over the client relationships and continue the work. A short handover period is included.',
  ARRAY[
    'Recurring annual maintenance contracts provide a predictable seasonal revenue base',
    'Loyal private client base built over 15 years — low cost of acquisition for a new owner',
    'Minimal asset base — hand tools and a small van included in the asking price',
    'Ideal first acquisition for an individual tradesperson looking to work independently',
    'Founder available for a handover period to introduce clients and transfer knowledge'
  ],
  'IT', 'Emilia-Romagna', 'construction', 2008,
  'under_500k', 'below_10', 'just_me', 'full_time',
  'under_500k', 'full_sale_only', '6_12_months', ARRAY['market_opportunity']
),

-- Listing 11: Off-Road Mountain Bike Tours | Centro, PT
(
  'draft',
  'Off-Road Mountain Bike Tours',
  'A guided off-road mountain bike tour operator based in the Serra da Lousã area of central Portugal, offering half-day, full-day, and multi-day routes through protected landscape. The business owns a fleet of 20 high-specification e-bikes and trail bikes and employs two certified guides. Tours are marketed primarily in English and attract a predominantly international clientele — mostly British, Dutch, and Scandinavian visitors. Bookings arrive through the company''s own website and two specialist adventure travel platforms. The founder is stepping back for personal health reasons and is committed to a clean handover, including a full season of introductions to key booking partners.',
  ARRAY[
    'Fleet of 20 owned e-bikes and trail bikes — no leasing obligations',
    'Specialist adventure travel platform partnerships driving consistent international bookings',
    'Serra da Lousã location offers year-round riding conditions — limited seasonality risk',
    'Consistent 4.8★ rating across booking platforms',
    'Founder committed to a full handover season including partner and platform introductions'
  ],
  'PT', 'Centro', 'leisure_entertainment', 2012,
  '500k_1m', '20_35', '2_5', 'part_time',
  '500k_1m', 'full_sale_only', '6_12_months', ARRAY['health_personal']
),

-- Listing 12: Taxi Licenses (×5) | Porto, PT
(
  'draft',
  'Taxi Licenses (×5)',
  'A portfolio of five taxi licenses operating in the Greater Porto area, held under a single owner who has operated in the sector for over 25 years. The licenses are leased to independent drivers on monthly fixed-fee contracts, creating a largely passive income structure for the owner. Driver turnover is low — most current drivers have operated under the licenses for more than three years. The asking price reflects the regulated scarcity value of Porto taxi licenses, which are no longer issued by the municipality, alongside the existing driver contracts and vehicles.',
  ARRAY[
    'Five Porto taxi licenses — no longer issued by the municipality, creating permanent scarcity value',
    'Fixed monthly driver contracts provide largely passive recurring income',
    'Low operational involvement required from the owner',
    'Stable driver base with multi-year tenure across the fleet',
    'Clean asset acquisition — licenses, vehicles, and contracts fully transferable'
  ],
  'PT', 'Norte', 'automotive_transport', 2000,
  '500k_1m', '10_20', '6_15', 'minimal',
  '500k_1m', 'full_sale_only', '1_2_years', ARRAY['retirement']
),

-- Listing 13: Trattoria & Wine Bar | Rome (Trastevere), IT
(
  'draft',
  'Trattoria & Wine Bar',
  'A neighbourhood trattoria and wine bar in Trastevere, operating from the same address for 16 years. The restaurant has built a reputation for honest Roman cooking and a thoughtfully curated wine list. Covers seat 55 indoors across two rooms, with six licensed outdoor tables available in warmer months. The kitchen runs a focused seasonal menu that changes monthly — this keeps food costs disciplined and gives the team genuine ownership of the offering. Revenue is driven primarily by dinner service, with a growing Sunday lunch trade. The owner is stepping back; the head chef has worked in the kitchen for nine years and intends to remain.',
  ARRAY[
    '16-year Trastevere address with a loyal local and repeat visitor clientele',
    'Head chef of nine years in place and intending to remain under new ownership',
    'Focused seasonal menu keeps food costs controlled and kitchen team motivated',
    '55 indoor covers plus six outdoor tables — full outdoor license in place',
    'Trastevere location ensures consistent walk-in traffic year-round from domestic and international visitors'
  ],
  'IT', 'Lazio', 'food_beverage', 2008,
  '500k_1m', '10_20', '6_15', 'part_time',
  '500k_1m', 'full_sale_only', 'ready_now', ARRAY['no_succession']
),

-- Listing 14: Arcade & Entertainment Room | Liguria, IT
(
  'draft',
  'Arcade & Entertainment Room',
  'A compact arcade and entertainment room operating in a commercial area near Genova, built around a curated selection of redemption machines, skill games, and retro cabinets. The business was designed from the outset for low staffing — a single part-time attendant covers peak hours, with machines running on cashless card systems that handle payments, credits, and prize redemption automatically. Revenue is consistent and largely passive; the owner monitors operations remotely and intervenes only for restocking and maintenance. The founder opened the space in 2019 and is looking to exit to pursue other ventures — the business requires minimal daily involvement and is well-suited to a first-time buyer or a passive investor.',
  ARRAY[
    'Near-fully automated operations — cashless systems handle payments and redemption with minimal staffing',
    'Consistent footfall from a mixed catchment of families, teenagers, and local regulars',
    'Low owner involvement — currently managed remotely with one part-time attendant',
    'Compact footprint with low rent relative to revenue — efficient unit economics',
    'Clear upside in extending opening hours or adding new machine formats without significant capex'
  ],
  'IT', 'Liguria', 'leisure_entertainment', 2019,
  'under_500k', '20_35', '2_5', 'minimal',
  '500k_1m', 'full_sale_only', '6_12_months', ARRAY['market_opportunity']
);

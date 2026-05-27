export type ListingStatus = 'draft' | 'in_review' | 'live' | 'rejected';

export interface Listing {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status: ListingStatus;

  // Step 1
  business_name: string | null;
  country: string | null;
  region: string | null;
  sector: string | null;
  year_founded: number | null;
  seller_email: string | null;
  seller_phone: string | null;

  // Step 2
  revenue_range: string | null;
  ebitda_margin: string | null;
  employee_count: string | null;
  owner_involvement: string | null;

  // Step 3
  asking_price: string | null;
  partial_sale: string | null;
  timeline: string | null;

  // Step 4
  reasons_for_sale: string[] | null;
  business_description: string | null;
  strongest_point: string | null;
  buyer_disclosure: string | null;

  // Operator-authored (Epic C)
  slug: string | null;
  title: string | null;
  about: string | null;
  highlights: string[] | null;
  buyer_tags: string[] | null;

  // Listing source
  source: string | null;

  // Locale-specific content (IT + PT)
  title_it: string | null;
  about_it: string | null;
  highlights_it: string[] | null;
  buyer_tags_it: string[] | null;
  title_pt: string | null;
  about_pt: string | null;
  highlights_pt: string[] | null;
  buyer_tags_pt: string[] | null;
}

export type EnquiryStatus = 'new' | 'reviewed' | 'forwarded' | 'closed';

export interface Enquiry {
  id: string;
  created_at: string;
  listing_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: EnquiryStatus;
}

export interface Step1Data {
  business_name: string;
  country: string;
  region: string;
  sector: string;
  year_founded: string;
  seller_email: string;
  seller_phone: string;
  photos: File[];
}

export interface BuyerSearch {
  id: string;
  created_at: string;
  sectors: string[] | null;
  industry_other: string | null;
  locations: string[];
  budget_range: string | null;
  primary_goal: string | null;
  target_return: string | null;
  search_timeline: string | null;
  has_acquired_before: boolean | null;
  background: string | null;
  needs_financing: string | null;
  name: string | null;
  email: string;
  phone: string | null;
}

export type BuyerSearchInsert = Omit<BuyerSearch, 'id' | 'created_at'>;

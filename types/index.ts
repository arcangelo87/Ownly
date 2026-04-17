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

  // Step 2
  revenue_range: string | null;
  ebitda_margin: string | null;
  employee_count: string | null;

  // Step 3
  asking_price: string | null;
  partial_sale: string | null;
  timeline: string | null;

  // Step 4
  reasons_for_sale: string[] | null;
  business_description: string | null;
  strongest_point: string | null;
  buyer_disclosure: string | null;
}

export interface Step1Data {
  business_name: string;
  country: string;
  region: string;
  sector: string;
  year_founded: string;
  photos: File[];
}

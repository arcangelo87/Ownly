-- Add locale-specific content columns for Italian and Portuguese listing pages.
-- Run in the Supabase dashboard SQL editor.

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS title_it      text,
  ADD COLUMN IF NOT EXISTS about_it      text,
  ADD COLUMN IF NOT EXISTS highlights_it text[],
  ADD COLUMN IF NOT EXISTS buyer_tags_it text[],
  ADD COLUMN IF NOT EXISTS title_pt      text,
  ADD COLUMN IF NOT EXISTS about_pt      text,
  ADD COLUMN IF NOT EXISTS highlights_pt text[],
  ADD COLUMN IF NOT EXISTS buyer_tags_pt text[];

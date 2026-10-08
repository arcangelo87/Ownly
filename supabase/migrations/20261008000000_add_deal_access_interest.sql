-- Pricing experiment on /en/portugal-deal-access.
-- One row per CTA click (event = 'click') and per form submission (event = 'submit').
CREATE TABLE IF NOT EXISTS deal_access_interest (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  tier        text        NOT NULL CHECK (tier IN ('single', 'all', 'managed')),
  event       text        NOT NULL CHECK (event IN ('click', 'submit')),
  email       text,
  criteria    text,
  deleted_at  timestamptz
);

ALTER TABLE deal_access_interest ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'deal_access_interest'
      AND policyname = 'Anyone can record deal access interest'
  ) THEN
    CREATE POLICY "Anyone can record deal access interest"
      ON deal_access_interest
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

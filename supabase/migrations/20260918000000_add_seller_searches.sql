CREATE TABLE IF NOT EXISTS seller_searches (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  vertical            text,
  vertical_other      text,
  revenue_range       text,
  had_valuation       text,
  priorities          text[],
  timeline            text,
  had_advisor_before  boolean,
  role                text,
  name                text,
  email               text        NOT NULL,
  phone               text,
  message             text,
  deleted_at          timestamptz
);

ALTER TABLE seller_searches ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'seller_searches'
      AND policyname = 'Anyone can submit a seller search'
  ) THEN
    CREATE POLICY "Anyone can submit a seller search"
      ON seller_searches
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

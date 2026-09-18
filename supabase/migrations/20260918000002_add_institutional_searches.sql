CREATE TABLE IF NOT EXISTS institutional_searches (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            timestamptz NOT NULL DEFAULT now(),
  sectors               text[],
  sector_other          text,
  ticket_size           text,
  has_committed_capital text,
  strategy              text[],
  timeline              text,
  has_acquired_before   boolean,
  buyer_type            text,
  name                  text,
  email                 text        NOT NULL,
  phone                 text,
  message               text,
  deleted_at            timestamptz
);

ALTER TABLE institutional_searches ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'institutional_searches'
      AND policyname = 'Anyone can submit an institutional search'
  ) THEN
    CREATE POLICY "Anyone can submit an institutional search"
      ON institutional_searches
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

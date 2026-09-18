CREATE TABLE IF NOT EXISTS mandate_enquiries (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  side        text        NOT NULL CHECK (side IN ('sell', 'buy')),
  vertical    text        NOT NULL CHECK (vertical IN ('accounting', 'insurance', 'lending', 'other')),
  name        text        NOT NULL,
  email       text        NOT NULL,
  phone       text,
  message     text,
  deleted_at  timestamptz
);

ALTER TABLE mandate_enquiries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'mandate_enquiries'
      AND policyname = 'Anyone can submit a mandate enquiry'
  ) THEN
    CREATE POLICY "Anyone can submit a mandate enquiry"
      ON mandate_enquiries
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

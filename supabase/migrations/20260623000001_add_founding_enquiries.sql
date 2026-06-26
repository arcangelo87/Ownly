-- Rename founding_enquiries to general_buyer_enquiries if the old name exists
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_enquiries') THEN
    ALTER TABLE founding_enquiries RENAME TO general_buyer_enquiries;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS general_buyer_enquiries (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  type        text        NOT NULL CHECK (type IN ('broker', 'buyer')),
  name        text        NOT NULL,
  email       text        NOT NULL,
  phone       text,
  message     text,
  deleted_at  timestamptz
);

ALTER TABLE general_buyer_enquiries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'general_buyer_enquiries'
      AND policyname = 'Anyone can submit a buyer enquiry'
  ) THEN
    CREATE POLICY "Anyone can submit a buyer enquiry"
      ON general_buyer_enquiries
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS contact_submissions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  name        text        NOT NULL,
  email       text        NOT NULL,
  telephone   text,
  message     text        NOT NULL,
  deleted_at  timestamptz
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'contact_submissions'
      AND policyname = 'Anyone can submit a contact message'
  ) THEN
    CREATE POLICY "Anyone can submit a contact message"
      ON contact_submissions
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

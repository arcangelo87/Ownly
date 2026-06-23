CREATE TABLE IF NOT EXISTS founding_enquiries (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  type        text        NOT NULL CHECK (type IN ('broker', 'buyer')),
  name        text        NOT NULL,
  email       text        NOT NULL,
  phone       text,
  message     text,
  deleted_at  timestamptz
);

ALTER TABLE founding_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a founding enquiry"
  ON founding_enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can submit a contact message"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

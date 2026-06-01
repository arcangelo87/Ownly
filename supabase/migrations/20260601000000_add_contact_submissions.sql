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

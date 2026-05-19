CREATE TABLE IF NOT EXISTS claims (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  slug        text        NOT NULL,
  listing_id  uuid        REFERENCES listings(id),
  name        text        NOT NULL,
  email       text        NOT NULL,
  message     text
);

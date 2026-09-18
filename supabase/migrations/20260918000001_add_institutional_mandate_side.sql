ALTER TABLE mandate_enquiries DROP CONSTRAINT IF EXISTS mandate_enquiries_side_check;

ALTER TABLE mandate_enquiries ADD CONSTRAINT mandate_enquiries_side_check
  CHECK (side IN ('sell', 'buy', 'institutional'));

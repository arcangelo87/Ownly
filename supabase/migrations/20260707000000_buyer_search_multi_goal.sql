ALTER TABLE buyer_searches
  ALTER COLUMN primary_goal TYPE text[] USING CASE WHEN primary_goal IS NULL THEN NULL ELSE ARRAY[primary_goal] END;

ALTER TABLE buyer_searches RENAME COLUMN primary_goal TO primary_goals;

ALTER TABLE buyer_searches DROP COLUMN IF EXISTS target_return;

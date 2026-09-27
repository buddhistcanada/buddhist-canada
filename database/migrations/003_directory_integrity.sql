-- Directory provenance and integrity.
ALTER TABLE buddhist_places ADD COLUMN IF NOT EXISTS source_checked_at DATE;
ALTER TABLE buddhist_places ADD COLUMN IF NOT EXISTS description TEXT;

UPDATE buddhist_places
SET source_checked_at = COALESCE(source_checked_at, last_updated_at::date)
WHERE source_checked_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_buddhist_places_source_checked ON buddhist_places (source_checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_buddhist_places_city_name ON buddhist_places (city, name);

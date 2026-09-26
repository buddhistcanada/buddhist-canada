CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS buddhist_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT NOT NULL,
  province_territory TEXT NOT NULL,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'Canada',
  phone TEXT,
  email TEXT,
  website TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  google_maps_url TEXT,
  tradition TEXT,
  languages TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','needs_review','archived')),
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  source_name TEXT,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_buddhist_places_search ON buddhist_places (province_territory, city, name);
CREATE INDEX IF NOT EXISTS idx_buddhist_places_status ON buddhist_places (status);

CREATE TABLE IF NOT EXISTS place_update_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES buddhist_places(id) ON DELETE CASCADE,
  changed_by TEXT,
  change_summary TEXT NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS place_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  province_territory TEXT NOT NULL,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  description TEXT,
  submitted_by TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

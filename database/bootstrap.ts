import type { Client } from 'pg'

const SCHEMA_SQL = `
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
`

const SEED_SQL = `
INSERT INTO buddhist_places (
  id, name, address, city, province_territory, postal_code, phone, email, website,
  tradition, status, verified, source_name, source_url, last_updated_at
) VALUES
  ('033f5b61-c1d2-5631-a8a2-438ee5ca213a', 'Calgary Buddhist Temple', '207 6th Street NE', 'Calgary', 'Alberta', 'T2E 3Y1', '(403) 263-5723', NULL, 'https://www.calgary-buddhist.ab.ca/', 'Mahayana', 'pending', FALSE, 'BuddhaNet World Buddhist Directory', 'https://www.buddhanet.info/wbd/province.php?province_id=9', '2026-09-26T00:00:00Z'),
  ('74577d53-2922-5483-aebc-6bc81bfc6dde', 'Buddhist Center Calgary', '10823 Brae Place SW', 'Calgary', 'Alberta', 'T2W 1E4', NULL, 'Calgary@diamondway-center.org', NULL, 'Vajrayana / Tibetan / Karma Kagyu', 'pending', FALSE, 'BuddhaNet World Buddhist Directory', 'https://www.buddhanet.info/wbd/province.php?province_id=9', '2026-09-26T00:00:00Z'),
  ('c066555d-bd14-55d2-b0fe-f1ee343065ec', 'Buddhist Center Edmonton', 'c/o Mike Freeland and BJ Tumanut #403, 10314 82nd Ave', 'Edmonton', 'Alberta', 'T6E 1Z8', '(780) 455-5488', 'Edmonton@diamondway-center.org', 'http://www.diamondway.org/edmonton/', 'Vajrayana / Tibetan / Karma Kagyu', 'pending', FALSE, 'BuddhaNet World Buddhist Directory', 'https://www.buddhanet.info/wbd/province.php?province_id=9', '2026-09-26T00:00:00Z'),
  ('aebdec83-f0c8-5c6b-afb4-a051c064597b', 'Buddhist Temple of Southern Alberta', '470 40 Street South', 'Lethbridge', 'Alberta', NULL, NULL, NULL, NULL, 'Mahayana', 'pending', FALSE, 'BuddhaNet World Buddhist Directory', 'https://www.buddhanet.info/wbd/province.php?province_id=9', '2026-09-26T00:00:00Z'),
  ('58a9f585-e5ad-55ba-968a-ad5f350f2e78', 'Myanmar Buddhist Temple - Calgary', '1408 27th Street SE', 'Calgary', 'Alberta', 'T2A 7A4', '(403) 460-3161', 'mbt069@gmail.com', NULL, 'Theravada / Vipassana', 'pending', FALSE, 'BuddhaNet World Buddhist Directory', 'https://www.buddhanet.info/wbd/province.php?province_id=9', '2026-09-26T00:00:00Z'),
  ('6a666934-b24b-5dc3-afd1-ad1d579fd87b', 'Buddhist Vihara Society in BC', '18941 80 Avenue', 'Surrey', 'British Columbia', 'V4N 4J1', '+1 604-888-1162', 'bvs_bc@yahoo.ca', 'http://www.bvs.org', 'Theravada', 'pending', FALSE, 'BuddhaNet World Buddhist Directory', 'https://www.buddhanet.info/wbd/country.php?country_id=1', '2026-09-26T00:00:00Z'),
  ('5de853e8-f268-5b86-a6b1-e4a619500f77', 'Manitoba Buddhist Temple', '39 Tecumseh St.', 'Winnipeg', 'Manitoba', 'R3E 0J8', NULL, 'ulrich@mts.ca', 'http://www.manitobabuddhistchurch.org', NULL, 'pending', FALSE, 'Buddhist Churches of Canada directory', 'https://www.vancouverhistory.ca/wp-content/uploads/2021/02/Buddhist-Churches-of-Canada.pdf', '2026-09-26T00:00:00Z'),
  ('e0c98dfb-ca57-5819-8c62-2b13a889669b', 'Toronto Buddhist Church / Living Dharma Centre', '1011 Sheppard Avenue West', 'Toronto', 'Ontario', 'M3H 2T7', '(416) 534-4302', 'tbc@tbc.on.ca', 'http://www.tbc.on.ca', NULL, 'pending', FALSE, 'Buddhist Churches of Canada directory', 'https://www.vancouverhistory.ca/wp-content/uploads/2021/02/Buddhist-Churches-of-Canada.pdf', '2026-09-26T00:00:00Z'),
  ('719dd8c1-07d6-501a-ab01-5771364859a0', 'Buddhist Prajna Temple', '265 King Street East, Unit 301', 'Kitchener', 'Ontario', 'N2G 4N4', '(519) 579-3046', 'prajna_temple@yahoo.com', 'http://www.prajnatemple.org', 'Mahayana / Pure Land', 'pending', FALSE, 'BuddhaNet World Buddhist Directory', 'https://www.buddhanet.info/wbd/country.php?country_id=1', '2026-09-26T00:00:00Z'),
  ('c48150b9-554f-553a-ae27-6a6c34fe2e3c', 'Buddhist Society of Newfoundland & Labrador', 'PO Box 432, Goulds', 'St. John''s', 'Newfoundland and Labrador', 'A1S 1G5', '(709) 745-3129', 'uperera@avalon.nf.ca', NULL, 'Theravada / Sri Lankan', 'pending', FALSE, 'BuddhaNet World Buddhist Directory', 'https://www.buddhanet.info/wbd/country.php?country_id=1', '2026-09-26T00:00:00Z'),
  ('24464bf8-10e0-5c37-8368-a4d12578caad', 'Atlantic Theravada Buddhist Cultural and Meditation Society', '817 Herring Cove Road', 'Halifax', 'Nova Scotia', NULL, NULL, NULL, 'http://www.atlanticbuddhist.com/', 'Theravada', 'pending', FALSE, 'Royal Thai Embassy Ottawa', 'https://ottawa.thaiembassy.org/en/page/buddhist-temples-and-monasteries', '2026-09-26T00:00:00Z'),
  ('9e08d798-dc15-5977-9aaf-f17c61cb94de', 'Tisarana Buddhist Monastery', '1356 Powers Road, RR#3', 'Perth', 'Ontario', 'K7H 3C5', '(613) 264-8208', NULL, 'https://www.tisarana.ca/', NULL, 'pending', FALSE, 'Royal Thai Embassy Ottawa', 'https://ottawa.thaiembassy.org/en/page/buddhist-temples-and-monasteries', '2026-09-26T00:00:00Z')
ON CONFLICT (id) DO NOTHING;
`

let initialization: Promise<void> | null = null

export function ensureDatabaseReady(client: Client) {
  if (!initialization) {
    initialization = (async () => {
      await client.query(SCHEMA_SQL)
      await client.query(SEED_SQL)
    })().catch((error) => {
      initialization = null
      throw error
    })
  }
  return initialization
}

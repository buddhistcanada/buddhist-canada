import { createDatabaseClient } from './client'
import { ensureDatabaseReady } from './bootstrap'

export type BuddhistPlaceRecord = {
  id: string
  name: string
  address?: string
  city: string
  province: string
  postalCode?: string
  phone?: string
  email?: string
  website?: string
  latitude?: number
  longitude?: number
  googleMapsUrl?: string
  tradition?: string
  verified: boolean
  status: 'pending' | 'verified' | 'needs_review' | 'archived'
  lastVerifiedAt?: string
  lastUpdatedAt: string
  sourceName: string
  sourceUrl: string
  sourceCheckedAt?: string
}

type PlacePatch = Partial<Omit<BuddhistPlaceRecord, 'id'>>
type CalgarySeed = { name: string; address?: string; postalCode?: string; phone?: string; email?: string; website?: string; tradition?: string; sourceName: string; sourceUrl: string }

const columns = `id, name, address, city, province_territory AS province, postal_code AS "postalCode", phone, email, website, latitude, longitude, google_maps_url AS "googleMapsUrl", tradition, verified, status, last_verified_at::text AS "lastVerifiedAt", last_updated_at::text AS "lastUpdatedAt", source_name AS "sourceName", source_url AS "sourceUrl", source_checked_at::text AS "sourceCheckedAt"`

const CALGARY_SEED: CalgarySeed[] = [
  { name: 'Calgary Buddhist Temple', address: '658 1 Avenue NE', postalCode: 'T2E 3Y1', phone: '403-263-5723', email: 'calgarybuddhisttemple@gmail.com', website: 'https://calgary-buddhist.ab.ca/', tradition: 'Mahayana / Jodo Shinshu', sourceName: 'Official Calgary Buddhist Temple', sourceUrl: 'https://calgary-buddhist.ab.ca/' },
  { name: 'Diamond Way Buddhist Center Calgary', address: '7628 Elbow Drive SW', postalCode: 'T2V 1K2', phone: '587-329-1416', email: 'calgary@diamondway.org', website: 'https://diamondway.org/calgary/', tradition: 'Vajrayana / Karma Kagyu', sourceName: 'Official Diamond Way Buddhist Center Calgary', sourceUrl: 'https://diamondway.org/calgary/' },
  { name: 'Akshobya Kadampa Buddhist Centre', address: '2120 Kensington Road NW', postalCode: 'T2N 3R7', phone: '403-454-7595', email: 'info@meditateincalgary.org', website: 'https://meditateincalgary.org/', tradition: 'Mahayana / Kadampa', sourceName: 'Official Akshobya Kadampa Buddhist Centre', sourceUrl: 'https://meditateincalgary.org/contact-us/' },
  { name: 'Jam Tse Cho Ling Tibetan Buddhist Temple Calgary', address: '924 36 St SE', postalCode: 'T2A 1B9', phone: '587-434-4011', email: 'contact@jtclcalgary.ca', website: 'https://jtclcalgary.ca/', tradition: 'Vajrayana / Tibetan', sourceName: 'Official Jam Tse Cho Ling Tibetan Buddhist Temple Calgary', sourceUrl: 'https://jtclcalgary.ca/' },
  { name: 'Calgary Buddhist Maha Vihara Association', address: '64 Templemont Circle NE', phone: '825-205-3379', email: 'calgarybmv@gmail.com', website: 'https://calgarybmv.ca/about/', tradition: 'Theravada', sourceName: 'Official Calgary Buddhist Maha Vihara Association', sourceUrl: 'https://calgarybmv.ca/about/' },
  { name: 'Calgary Buddhist Meditation Centre', address: '#110, 138 18th Ave SE', postalCode: 'T2G 5P9', phone: '403-554-4350', email: 'amalatr@gmail.com', website: 'http://calgarybuddhistmeditation.ca/', tradition: 'Mahayana', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name: 'Calgary MaChik Chöling', address: '6319 Thorncliffe Dr NW', postalCode: 'T2K 3A8', phone: '403-283-8744', email: 'dechen.namdrol@ngakpahouse.ca', website: 'http://ngakpahouse.ca', tradition: 'Vajrayana / Kagyu-Nyingma / Chöd', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/region.php?offset=2250&region_id=1' },
  { name: 'Calgary Shambhala Meditation Group', phone: '403-809-1655', email: 'fpjohns@gmail.com', website: 'https://www.shambhala.org/', tradition: 'Vajrayana / Shambhala', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/province.php?offset=6900' },
  { name: 'Myanmar Buddhist Temple - Calgary', address: '1408 27th Street SE', postalCode: 'T2A 7A4', phone: '403-460-3161', email: 'mbt069@gmail.com', website: 'https://calgarymyanmartemple.ca/', tradition: 'Theravada / Vipassana', sourceName: 'BuddhaNet World Buddhist Directory / City of Calgary', sourceUrl: 'https://www.calgary.ca/content/dam/www/programs-services/parks-recreation/arts-and-culture-in-calgary/cross-cultural-resources/cross-cultural-connections.pdf' },
  { name: 'True Buddha Pai Yuin Temple', address: '1809 Centre Street N', postalCode: 'T2E 2S5', phone: '403-230-7427', email: 'infotbpyt@yahoo.com', tradition: 'Vajrayana / True Buddha School', sourceName: 'True Buddha School / Pai Yuin Temple publication', sourceUrl: 'https://en.tbsn.org/uploads/download/2021_02_24/bb6329490d8cf6605cf14728463ac719.pdf' },
  { name: 'Sri Lankan Buddhist Society of Calgary', phone: '403-280-9729', email: 'ehipassiko@lankamail.com', website: 'http://ehipassiko-calgary.org/', tradition: 'Theravada / Sri Lankan', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/city.php?..=&offset=5100' },
  { name: 'Vietnamese Buddhist Cultural Centre of Calgary', address: '1720 36 Street SE', postalCode: 'T2A 1C8', phone: '403-235-3060', tradition: 'Mahayana / Vietnamese', sourceName: 'Alberta Cross Cultural Connections directory', sourceUrl: 'https://www.alhcalgary.com/_files/ugd/0d2ef4_dcfbeb49a71f4bbe9289bce71a972bde.pdf' },
  { name: 'Khmer-Canadian Buddhist Cultural Society', address: '7011 Ogden Road SE', postalCode: 'T2C 1B5', phone: '403-235-5415', email: 'khmerview@cambodianview.com', website: 'http://www.cambodianview.com', tradition: 'Theravada', sourceName: 'City of Calgary Cross Cultural Connections', sourceUrl: 'https://www.calgary.ca/content/dam/www/programs-services/parks-recreation/arts-and-culture-in-calgary/cross-cultural-resources/cross-cultural-connections.pdf' },
  { name: 'Calgary Insight Meditation Society', address: '3515 35 Avenue SW', postalCode: 'T3E 1A2', phone: '403-257-1156', email: 'info@calgaryims.org', website: 'https://www.calgaryims.org/', tradition: 'Theravada / Insight Meditation', sourceName: 'Official Calgary Insight Meditation Society', sourceUrl: 'https://www.calgaryims.org/about' },
  { name: 'Calgary Theravada Meditation Group', address: '3212 6th Street SW', postalCode: 'T2S 2M3', phone: '403-243-3433', tradition: 'Theravada', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name: 'Meditation & Yoga Center of Calgary', address: '2028 33 Avenue SW', postalCode: 'T2T 1X4', email: 'four_dharma@hotmail.com', website: 'http://www.yogameditationcentercalgary.ca', tradition: 'Theravada', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name: 'Bodhi Mitta Calgary', address: '4935 20 Ave NW', tradition: 'Theravada / Buddhist Meditation', sourceName: 'Canmore Theravada Buddhist Community', sourceUrl: 'https://www.canmoretheravadabuddhism.ca/practice-opportunities' },
  { name: 'Lian Yin Buddha Charitable Foundation', address: '135 18 Ave NE', postalCode: 'T2E 1N1', phone: '403-262-9228', tradition: 'Buddhist', sourceName: 'Calgary religious organizations directory', sourceUrl: 'https://cdn.canpages.ca/business/AB/calgary/churches-hindu/91-158021.html' },
  { name: 'Avatamsaka Monastery', address: '1009 4 Avenue SW', postalCode: 'T2P 0K8', phone: '403-234-0644', email: 'avatamsaka@drba.org', website: 'https://www.avatamsak.ca/', tradition: 'Mahayana / Chan', sourceName: 'City of Calgary Cross Cultural Connections', sourceUrl: 'https://www.calgary.ca/content/dam/www/programs-services/parks-recreation/arts-and-culture-in-calgary/cross-cultural-resources/cross-cultural-connections.pdf' },
]

async function ensureCalgaryResearch(client: ReturnType<typeof createDatabaseClient>) {
  for (const place of CALGARY_SEED) {
    await client.query(`UPDATE buddhist_places SET address=COALESCE($1,address), postal_code=COALESCE($2,postal_code), phone=COALESCE($3,phone), email=COALESCE($4,email), website=COALESCE($5,website), tradition=COALESCE($6,tradition), source_name=$7, source_url=$8, source_checked_at=CURRENT_DATE, last_updated_at=NOW() WHERE LOWER(name)=LOWER($9) AND LOWER(city)='calgary' AND LOWER(province_territory)='alberta' AND verified=FALSE`, [place.address ?? null, place.postalCode ?? null, place.phone ?? null, place.email ?? null, place.website ?? null, place.tradition ?? null, place.sourceName, place.sourceUrl, place.name])
    await client.query(`INSERT INTO buddhist_places (name,address,city,province_territory,postal_code,phone,email,website,tradition,status,verified,source_name,source_url,source_checked_at,last_updated_at) SELECT $1,$2,'Calgary','Alberta',$3,$4,$5,$6,$7,'pending',FALSE,$8,$9,CURRENT_DATE,NOW() WHERE NOT EXISTS (SELECT 1 FROM buddhist_places WHERE LOWER(name)=LOWER($1) AND LOWER(city)='calgary' AND LOWER(province_territory)='alberta')`, [place.name, place.address ?? null, place.postalCode ?? null, place.phone ?? null, place.email ?? null, place.website ?? null, place.tradition ?? null, place.sourceName, place.sourceUrl])
  }
}

async function withClient<T>(work: (client: ReturnType<typeof createDatabaseClient>) => Promise<T>) {
  const client = createDatabaseClient()
  await client.connect()
  try {
    await ensureDatabaseReady(client)
    await ensureCalgaryResearch(client)
    return await work(client)
  } finally {
    await client.end()
  }
}

export async function listPlaces(filters: { q?: string; province?: string } = {}) {
  return withClient(async (client) => {
    const values: string[] = []
    const conditions: string[] = []
    if (filters.q) { values.push(`%${filters.q}%`); const p = values.length; conditions.push(`(name ILIKE $${p} OR city ILIKE $${p} OR province_territory ILIKE $${p} OR address ILIKE $${p} OR email ILIKE $${p} OR phone ILIKE $${p})`) }
    if (filters.province) { values.push(filters.province); conditions.push(`province_territory = $${values.length}`) }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const result = await client.query(`SELECT ${columns} FROM buddhist_places ${where} ORDER BY name`, values)
    return result.rows as BuddhistPlaceRecord[]
  })
}

export async function findPlaceById(id: string) {
  return withClient(async (client) => { const result = await client.query(`SELECT ${columns} FROM buddhist_places WHERE id = $1 LIMIT 1`, [id]); return (result.rows[0] as BuddhistPlaceRecord | undefined) || null })
}

export async function updatePlace(id: string, patch: PlacePatch) {
  const allowed: Record<string, string> = { name:'name', address:'address', city:'city', province:'province_territory', postalCode:'postal_code', phone:'phone', email:'email', website:'website', latitude:'latitude', longitude:'longitude', googleMapsUrl:'google_maps_url', tradition:'tradition', verified:'verified', status:'status', lastVerifiedAt:'last_verified_at', sourceName:'source_name', sourceUrl:'source_url' }
  const entries = Object.entries(patch).filter(([key, value]) => allowed[key] && value !== undefined)
  if (!entries.length) throw new Error('No valid fields supplied')
  return withClient(async (client) => { const values: unknown[]=[]; const assignments=entries.map(([key,value],index)=>{values.push(value);return `${allowed[key]} = $${index+1}`}); values.push(id); const result=await client.query(`UPDATE buddhist_places SET ${assignments.join(', ')}, last_updated_at=NOW() WHERE id=$${values.length} RETURNING ${columns}`, values); if(!result.rowCount)return null; return result.rows[0] as BuddhistPlaceRecord })
}

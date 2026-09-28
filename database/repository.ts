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
type ResearchSeed = { name: string; city: string; province: string; address?: string; postalCode?: string; phone?: string; email?: string; website?: string; tradition?: string; sourceName: string; sourceUrl: string }

const columns = `id, name, address, city, province_territory AS province, postal_code AS "postalCode", phone, email, website, latitude, longitude, google_maps_url AS "googleMapsUrl", tradition, verified, status, last_verified_at::text AS "lastVerifiedAt", last_updated_at::text AS "lastUpdatedAt", source_name AS "sourceName", source_url AS "sourceUrl", source_checked_at::text AS "sourceCheckedAt"`

const RESEARCH_SEED: ResearchSeed[] = [
  { name:'Calgary Buddhist Temple', city:'Calgary', province:'Alberta', address:'207 6th Street NE', postalCode:'T2E 3Y1', phone:'403-281-1203', website:'http://www.calgary-buddhist.ab.ca/', tradition:'Mahayana / Jodo Shinshu', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name:'Buddhist Center Calgary', city:'Calgary', province:'Alberta', address:'10823 Brae Place SW', postalCode:'T2W 1E4', email:'Calgary@diamondway-center.org', website:'https://diamondway.org/calgary/', tradition:'Vajrayana / Tibetan / Karma Kagyu', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name:'Diamond Way Buddhist Center Calgary', city:'Calgary', province:'Alberta', address:'7628 Elbow Drive SW', postalCode:'T2V 1K2', phone:'587-329-1416', email:'calgary@diamondway.org', website:'https://diamondway.org/calgary/', tradition:'Vajrayana / Karma Kagyu', sourceName:'Official Diamond Way Buddhist Center Calgary', sourceUrl:'https://diamondway.org/calgary/' },
  { name:'Akshobya Kadampa Buddhist Centre', city:'Calgary', province:'Alberta', address:'2120 Kensington Road NW', postalCode:'T2N 3R7', phone:'403-454-7595', email:'info@meditateincalgary.org', website:'https://meditateincalgary.org/', tradition:'Mahayana / Kadampa', sourceName:'Official Akshobya Kadampa Buddhist Centre', sourceUrl:'https://meditateincalgary.org/contact-us/' },
  { name:'Jam Tse Cho Ling Tibetan Buddhist Temple Calgary', city:'Calgary', province:'Alberta', address:'924 36 St SE', postalCode:'T2A 1B9', phone:'587-434-4011', email:'contact@jtclcalgary.ca', website:'https://jtclcalgary.ca/', tradition:'Vajrayana / Tibetan', sourceName:'Official Jam Tse Cho Ling Tibetan Buddhist Temple Calgary', sourceUrl:'https://jtclcalgary.ca/' },
  { name:'Calgary Buddhist Maha Vihara Association', city:'Calgary', province:'Alberta', address:'64 Templemont Circle NE', phone:'825-205-3379', email:'calgarybmv@gmail.com', website:'https://calgarybmv.ca/about/', tradition:'Theravada', sourceName:'Official Calgary Buddhist Maha Vihara Association', sourceUrl:'https://calgarybmv.ca/about/' },
  { name:'Calgary Buddhist Meditation Centre', city:'Calgary', province:'Alberta', address:'#110, 138 18th Ave SE', postalCode:'T2G 5P9', phone:'403-554-4350', email:'amalatr@gmail.com', website:'http://calgarybuddhistmeditation.ca/', tradition:'Mahayana', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name:'Calgary MaChik Chöling', city:'Calgary', province:'Alberta', address:'6319 Thorncliffe Dr NW', postalCode:'T2K 3A8', phone:'403-283-8744', email:'dechen.namdrol@ngakpahouse.ca', website:'http://ngakpahouse.ca', tradition:'Vajrayana / Kagyu-Nyingma / Chöd', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/region.php?offset=2250&region_id=1' },
  { name:'Calgary Shambhala Meditation Group', city:'Calgary', province:'Alberta', phone:'403-809-1655', email:'fpjohns@gmail.com', website:'https://www.shambhala.org/', tradition:'Vajrayana / Shambhala', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?offset=6900' },
  { name:'Myanmar Buddhist Temple - Calgary', city:'Calgary', province:'Alberta', address:'1408 27th Street SE', postalCode:'T2A 7A4', phone:'403-460-3161', email:'mbt069@gmail.com', website:'https://calgarymyanmartemple.ca/', tradition:'Theravada / Vipassana', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name:'True Buddha Pai Yuin Temple', city:'Calgary', province:'Alberta', address:'117 28th Avenue NE', postalCode:'T2E 2A9', phone:'403-230-7427', tradition:'Mahayana / True Buddha School', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?offset=25&province_id=9' },
  { name:'Sri Lankan Buddhist Society of Calgary / Ehipassiko Meditation Centre', city:'Calgary', province:'Alberta', address:'5107 Whitestone Road NE', postalCode:'T1Y 1T4', phone:'403-280-9729', email:'ehipassiko@lankamail.com', website:'http://ehipassiko-calgary.org/', tradition:'Theravada / Sri Lankan', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/country.php?country_id=1&offset=300' },
  { name:'Vietnamese Buddhist Cultural Centre of Calgary', city:'Calgary', province:'Alberta', address:'1720 36 Street SE', postalCode:'T2A 1C8', phone:'403-235-3060', tradition:'Mahayana / Vietnamese', sourceName:'Alberta Cross Cultural Connections directory', sourceUrl:'https://www.alhcalgary.com/_files/ugd/0d2ef4_dcfbeb49a71f4bbe9289bce71a972bde.pdf' },
  { name:'Khmer-Canadian Buddhist Cultural Society', city:'Calgary', province:'Alberta', address:'7011 Ogden Road SE', postalCode:'T2C 1B5', phone:'403-235-5415', email:'khmerview@cambodianview.com', website:'http://www.cambodianview.com', tradition:'Theravada', sourceName:'City of Calgary Cross Cultural Connections', sourceUrl:'https://www.calgary.ca/content/dam/www/programs-services/parks-recreation/arts-and-culture-in-calgary/cross-cultural-resources/cross-cultural-connections.pdf' },
  { name:'Calgary Insight Meditation Society', city:'Calgary', province:'Alberta', address:'3515 35 Avenue SW', postalCode:'T3E 1A2', phone:'403-257-1156', email:'info@calgaryims.org', website:'https://www.calgaryims.org/', tradition:'Theravada / Insight Meditation', sourceName:'Official Calgary Insight Meditation Society', sourceUrl:'https://www.calgaryims.org/about' },
  { name:'Calgary Theravada Meditation Group', city:'Calgary', province:'Alberta', address:'3212 6th Street SW', postalCode:'T2S 2M3', phone:'403-243-3433', tradition:'Theravada', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name:'Meditation & Yoga Center of Calgary', city:'Calgary', province:'Alberta', address:'2028 33 Avenue SW', postalCode:'T2T 1X4', email:'four_dharma@hotmail.com', website:'http://www.yogameditationcentercalgary.ca', tradition:'Theravada', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name:'Mon Buddhist Temple (Canada)', city:'Calgary', province:'Alberta', address:'3424 Temple Road NE', postalCode:'T1Y 3A9', email:'mbtcnd@gmail.com', tradition:'Theravada', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name:'Lian Yin Buddha Charitable Foundation', city:'Calgary', province:'Alberta', address:'135 18 Ave NE', postalCode:'T2E 1N1', phone:'403-262-9228', tradition:'Buddhist', sourceName:'Calgary religious organizations directory', sourceUrl:'https://cdn.canpages.ca/business/AB/calgary/churches-hindu/91-158021.html' },
  { name:'Ratchathamviriyaram Buddhist Temple', city:'Calgary', province:'Alberta', address:'7248 25 Street SE', postalCode:'T2C 1A1', phone:'403-279-9155', website:'http://www.willpowerinstitute.com/content/meditation-centers', tradition:'Theravada / Thai Dhammayutti', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?offset=25&province_id=9' },
  { name:'Pai Yuin Tang Buddhist Congregation', city:'Calgary', province:'Alberta', address:'117 28th Avenue NE', postalCode:'T2E 2A9', phone:'403-230-7427', tradition:'Mahayana / True Buddha School', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?offset=25&province_id=9' },
  { name:'Alberta Vipassana Foundation / Alberta Vipassana Meditation Centre', city:'Youngstown', province:'Alberta', address:'Dhamma Karuṇā - 30003 Range Road 93', postalCode:'T0J 3P0', phone:'403-282-3413', email:'Info@karuna.dhamma.org', website:'https://www.karuna.dhamma.org/', tradition:'Theravada / Vipassana', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name:'Amitabha Kadampa Buddhist Centre', city:'Edmonton', province:'Alberta', address:'11148 84 Ave', postalCode:'T6G 0T9', phone:'780-412-1006', email:'info@MeditationEdmonton.org', website:'http://www.MeditationEdmonton.org', tradition:'Vajrayana / Tibetan / New Kadampa', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name:'Buddhist Center Edmonton', city:'Edmonton', province:'Alberta', address:'10314 82nd Ave, #403', postalCode:'T6E 1Z8', phone:'780-455-5488', email:'Edmonton@diamondway-center.org', website:'http://www.diamondway.org/edmonton/', tradition:'Vajrayana / Tibetan / Karma Kagyu', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/country.php?country_id=1&offset=25' },
  { name:'Mui Kwok Buddhist Temple', city:'Edmonton', province:'Alberta', address:'11036 96 Street', postalCode:'T5H 2K9', phone:'780-424-7566', email:'chingkwok2006@yahoo.com', tradition:'Mahayana / Chinese', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name:'Pitaka Society', city:'Edmonton', province:'Alberta', email:'chandevg@hotmail.com', tradition:'Theravada / Sri Lankan', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?offset=175&country_id=1' },
  { name:'Novayana House', city:'Edmonton', province:'Alberta', address:'10139 72 Street', postalCode:'T6A 2W2', phone:'403-438-3574', tradition:'Vajrayana', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?offset=25&province_id=9' },
  { name:'Buddhist Temple of Southern Alberta', city:'Lethbridge', province:'Alberta', address:'470 40 Street South', tradition:'Mahayana', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name:'Bow Valley Sangha', city:'Canmore', province:'Alberta', address:'518 2nd Street', postalCode:'T1W 2K5', phone:'403-678-2034', tradition:'Mahayana / Vietnamese / Zen', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name:'Dynamic Insight Meditation & Study Group', city:'Redwood Meadows', province:'Alberta', phone:'403-949-3858', email:'mmcalver@telusplanet.net', tradition:'Theravada / Vipassana', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=9' },
  { name:'Westlock Meditation Centre', city:'Westlock', province:'Alberta', address:'58012 Range Rd. 270', tradition:'Mahayana / Vietnamese Zen / Pureland', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/country.php?country_id=1&offset=250' },
  { name:'Westend Buddhist Centre / Halton-Peel Buddhist Society', city:'Mississauga', province:'Ontario', address:'3133 Cawthra Road', postalCode:'L5A 2X4', email:'westendbuddhist@yahoo.ca', website:'http://www.westendbuddhist.com', tradition:'Theravada / Sri Lankan', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?offset=75&province_id=18' },
  { name:'Windsor Buddhist Vihara', city:'Windsor', province:'Ontario', address:'691 Campbell Ave', postalCode:'N9B 2H6', phone:'519-256-4223', email:'info@windsorbuddhistvihara.com', website:'http://www.windsorbuddhistvihara.com', tradition:'Theravada', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?offset=75&province_id=18' },
  { name:'World Peace Ten Thousand Buddhas Sarina Stupa Temple', city:'Niagara Falls', province:'Ontario', address:'4303 River Road', postalCode:'L2E 3E8', phone:'905-371-2678', tradition:'Mahayana / Pure Land', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?offset=75&province_id=18' },
  { name:'Zen Centre of Ottawa', city:'Ottawa', province:'Ontario', address:'240 Daly Avenue', postalCode:'K1N 6G2', phone:'613-562-1568', email:'info@wwzc.org', website:'http://www.wwzc.org', tradition:'Mahayana / Zen', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?offset=75&province_id=18' },
  { name:'Sirimangalo International Monastery & Meditation Centre', city:'Hamilton', province:'Ontario', address:'31 Beaucourt Road', postalCode:'L8S 2R1', phone:'905-581-8522', email:'sirimangalointl@gmail.com', website:'https://www.sirimangalo.org/', tradition:'Theravada / Vipassana', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?offset=100&province_id=18' },
  { name:'Quebec Vipassana Meditation Centre', city:'Sutton', province:'Quebec', address:'Dhamma Suttama', phone:'514-481-3504', email:'info@suttama.dhamma.org', website:'http://www.suttama.dhamma.org/', tradition:'Theravada / Vipassana', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?offset=175&country_id=1' },
  { name:'Centre Paramita de bouddhisme tibétain du Québec', city:'Quebec City', province:'Quebec', address:'1156 rue Louis-Armand-Desjardins', postalCode:'G1Y 2B3', phone:'418-657-5741', email:'info@centreparamita.org', website:'http://www.centreparamita.org', tradition:'Vajrayana / Tibetan Gelugpa', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=20' },
  { name:'Centre Bouddhiste Kankala', city:'Montreal', province:'Quebec', address:'823 Dultuth Est', postalCode:'H2L 1B2', phone:'514-521-2529', email:'info@kankala.org', website:'http://www.kankala.org', tradition:'Vajrayana / Tibetan', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?province_id=20' },
  { name:'Buddhist Society of Newfoundland & Labrador', city:"St. John's", province:'Newfoundland and Labrador', address:'PO Box 432, Goulds', postalCode:'A1S 1G5', phone:'709-745-3129', email:'uperera@avalon.nf.ca', tradition:'Theravada / Sri Lankan', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/region.php?region_id=1' },
  { name:'Snare River Meditation Group', city:'Whitehorse', province:'Yukon', address:'Wood Street', postalCode:'Y1A 2E3', email:'wolfgang_zyahoo.com', tradition:'Theravada', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/province.php?offset=5000&prov=' },
  { name:'Yukon Theravāda', city:'Whitehorse', province:'Yukon', email:'Inquiry@alaskatheravada.org', website:'https://alaskatheravada.org/yukon/', tradition:'Theravada / Wilderness Meditation', sourceName:'BuddhaNet World Buddhist Directory', sourceUrl:'https://www.buddhanet.info/wbd/country.php?country_id=tetueqmg&offset=8850' },
]

function normalizeName(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() }

async function ensureResearch(client: ReturnType<typeof createDatabaseClient>) {
  for (const place of RESEARCH_SEED) {
    const normalized = normalizeName(place.name)
    const existing = await client.query(`SELECT id FROM buddhist_places WHERE LOWER(city)=LOWER($1) AND LOWER(province_territory)=LOWER($2) AND regexp_replace(lower(name),'[^a-z0-9]+','','g')=regexp_replace(lower($3),'[^a-z0-9]+','','g') LIMIT 1`, [place.city, place.province, place.name])
    if (existing.rowCount) {
      await client.query(`UPDATE buddhist_places SET address=COALESCE(address,$1), postal_code=COALESCE(postal_code,$2), phone=COALESCE(phone,$3), email=COALESCE(email,$4), website=COALESCE(website,$5), tradition=COALESCE(tradition,$6), source_name=$7, source_url=$8, source_checked_at=CURRENT_DATE, last_updated_at=NOW() WHERE id=$9 AND verified=FALSE`, [place.address ?? null, place.postalCode ?? null, place.phone ?? null, place.email ?? null, place.website ?? null, place.tradition ?? null, place.sourceName, place.sourceUrl, existing.rows[0].id])
    } else {
      await client.query(`INSERT INTO buddhist_places (name,address,city,province_territory,postal_code,phone,email,website,tradition,status,verified,source_name,source_url,source_checked_at,last_updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending',FALSE,$10,$11,CURRENT_DATE,NOW())`, [place.name, place.address ?? null, place.city, place.province, place.postalCode ?? null, place.phone ?? null, place.email ?? null, place.website ?? null, place.tradition ?? null, place.sourceName, place.sourceUrl])
    }
    void normalized
  }
}

async function withClient<T>(work: (client: ReturnType<typeof createDatabaseClient>) => Promise<T>) {
  const client = createDatabaseClient()
  await client.connect()
  try { await ensureDatabaseReady(client); await ensureResearch(client); return await work(client) } finally { await client.end() }
}

export async function listPlaces(filters: { q?: string; province?: string } = {}) {
  return withClient(async (client) => {
    const values: string[] = []; const conditions: string[] = []
    if (filters.q) { values.push(`%${filters.q}%`); const p=values.length; conditions.push(`(name ILIKE $${p} OR city ILIKE $${p} OR province_territory ILIKE $${p} OR address ILIKE $${p} OR email ILIKE $${p} OR phone ILIKE $${p})`) }
    if (filters.province) { values.push(filters.province); conditions.push(`province_territory=$${values.length}`) }
    const where=conditions.length?`WHERE ${conditions.join(' AND ')}`:''
    const result=await client.query(`SELECT ${columns} FROM buddhist_places ${where} ORDER BY province_territory, city, name`, values)
    return result.rows as BuddhistPlaceRecord[]
  })
}

export async function findPlaceById(id: string) { return withClient(async client => { const result=await client.query(`SELECT ${columns} FROM buddhist_places WHERE id=$1 LIMIT 1`,[id]); return (result.rows[0] as BuddhistPlaceRecord|undefined)||null }) }

export async function updatePlace(id: string, patch: PlacePatch) {
  const allowed: Record<string,string>={name:'name',address:'address',city:'city',province:'province_territory',postalCode:'postal_code',phone:'phone',email:'email',website:'website',latitude:'latitude',longitude:'longitude',googleMapsUrl:'google_maps_url',tradition:'tradition',verified:'verified',status:'status',lastVerifiedAt:'last_verified_at',sourceName:'source_name',sourceUrl:'source_url'}
  const entries=Object.entries(patch).filter(([key,value])=>allowed[key]&&value!==undefined)
  if(!entries.length) throw new Error('No valid fields supplied')
  return withClient(async client=>{const values:unknown[]=[];const assignments=entries.map(([key,value],index)=>{values.push(value);return `${allowed[key]}=$${index+1}`});values.push(id);const result=await client.query(`UPDATE buddhist_places SET ${assignments.join(',')},last_updated_at=NOW() WHERE id=$${values.length} RETURNING ${columns}`,values);if(!result.rowCount)return null;return result.rows[0] as BuddhistPlaceRecord})
}

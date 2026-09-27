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

const columns = `id, name, address, city, province_territory AS province, postal_code AS "postalCode", phone, email, website, latitude, longitude, google_maps_url AS "googleMapsUrl", tradition, verified, status, last_verified_at::text AS "lastVerifiedAt", last_updated_at::text AS "lastUpdatedAt", source_name AS "sourceName", source_url AS "sourceUrl", source_checked_at::text AS "sourceCheckedAt"`

async function withClient<T>(work: (client: ReturnType<typeof createDatabaseClient>) => Promise<T>) {
  const client = createDatabaseClient()
  await client.connect()
  try {
    await ensureDatabaseReady(client)
    return await work(client)
  } finally {
    await client.end()
  }
}

export async function listPlaces(filters: { q?: string; province?: string } = {}) {
  return withClient(async (client) => {
    const values: string[] = []
    const conditions: string[] = []
    if (filters.q) {
      values.push(`%${filters.q}%`)
      const p = values.length
      conditions.push(`(name ILIKE $${p} OR city ILIKE $${p} OR province_territory ILIKE $${p} OR address ILIKE $${p} OR email ILIKE $${p} OR phone ILIKE $${p})`)
    }
    if (filters.province) {
      values.push(filters.province)
      conditions.push(`province_territory = $${values.length}`)
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const result = await client.query(`SELECT ${columns} FROM buddhist_places ${where} ORDER BY name`, values)
    return result.rows as BuddhistPlaceRecord[]
  })
}

export async function findPlaceById(id: string) {
  return withClient(async (client) => {
    const result = await client.query(`SELECT ${columns} FROM buddhist_places WHERE id = $1 LIMIT 1`, [id])
    return (result.rows[0] as BuddhistPlaceRecord | undefined) || null
  })
}

export async function updatePlace(id: string, patch: PlacePatch) {
  const allowed: Record<string, string> = { name: 'name', address: 'address', city: 'city', province: 'province_territory', postalCode: 'postal_code', phone: 'phone', email: 'email', website: 'website', latitude: 'latitude', longitude: 'longitude', googleMapsUrl: 'google_maps_url', tradition: 'tradition', verified: 'verified', status: 'status', lastVerifiedAt: 'last_verified_at', sourceName: 'source_name', sourceUrl: 'source_url' }
  const entries = Object.entries(patch).filter(([key, value]) => allowed[key] && value !== undefined)
  if (!entries.length) throw new Error('No valid fields supplied')

  return withClient(async (client) => {
    const values: unknown[] = []
    const assignments = entries.map(([key, value], index) => { values.push(value); return `${allowed[key]} = $${index + 1}` })
    values.push(id)
    const result = await client.query(`UPDATE buddhist_places SET ${assignments.join(', ')}, last_updated_at = NOW() WHERE id = $${values.length} RETURNING ${columns}`, values)
    if (!result.rowCount) return null
    return result.rows[0] as BuddhistPlaceRecord
  })
}

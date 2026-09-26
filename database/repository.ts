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
  lastVerifiedAt?: string
  lastUpdatedAt: string
  sourceName: string
  sourceUrl: string
}

/**
 * PostgreSQL repository contract.
 * Runtime configuration should provide DATABASE_URL.
 * Keep all database access behind this interface so the API/UI do not depend on a specific driver.
 */
export interface BuddhistPlaceRepository {
  list(filters?: { q?: string; province?: string }): Promise<BuddhistPlaceRecord[]>
  getById(id: string): Promise<BuddhistPlaceRecord | null>
  create(place: Omit<BuddhistPlaceRecord, 'id' | 'lastUpdatedAt'>): Promise<BuddhistPlaceRecord>
  update(id: string, patch: Partial<BuddhistPlaceRecord>): Promise<BuddhistPlaceRecord>
  archive(id: string): Promise<void>
}

export function requireDatabaseUrl() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not configured')
  return url
}

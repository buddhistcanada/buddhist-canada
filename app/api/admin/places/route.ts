import { NextResponse } from 'next/server'

export type AdminPlace = {
  id: string
  name: string
  city: string
  province: string
  status: 'pending' | 'verified' | 'needs_review' | 'archived'
  sourceName: string
  sourceUrl: string
  lastUpdatedAt: string
  lastVerifiedAt?: string
}

// Temporary in-memory adapter. Replace with PostgreSQL repository calls when DATABASE_URL is configured.
const places: AdminPlace[] = [
  {
    id: 'calgary-001',
    name: 'Calgary Buddhist Temple',
    city: 'Calgary',
    province: 'Alberta',
    status: 'pending',
    sourceName: 'BuddhaNet World Buddhist Directory',
    sourceUrl: 'https://www.buddhanet.info/wbd/province.php?province_id=9',
    lastUpdatedAt: '2026-09-26',
  },
]

export async function GET() {
  return NextResponse.json({ places })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const id = String(body.id || '')
  const status = body.status as AdminPlace['status']
  const place = places.find((item) => item.id === id)

  if (!place) return NextResponse.json({ error: 'Place not found' }, { status: 404 })
  if (!['pending', 'verified', 'needs_review', 'archived'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  if (status === 'verified' && (!place.sourceName || !place.sourceUrl)) {
    return NextResponse.json({ error: 'A source is required before verification' }, { status: 400 })
  }

  place.status = status
  place.lastUpdatedAt = new Date().toISOString()
  if (status === 'verified') place.lastVerifiedAt = place.lastUpdatedAt

  return NextResponse.json({ place })
}

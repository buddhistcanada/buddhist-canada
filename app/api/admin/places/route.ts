import { NextResponse } from 'next/server'
import { listPlaces, updatePlace } from '../../../../database/repository'

function isAuthorized(request: Request) {
  const expected = process.env.ADMIN_API_KEY
  const supplied = request.headers.get('x-admin-api-key')
  return Boolean(expected && supplied && supplied === expected)
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { searchParams } = new URL(request.url)
    const places = await listPlaces({ q: searchParams.get('q') || undefined, province: searchParams.get('province') || undefined })
    return NextResponse.json({ places })
  } catch (error) {
    console.error('Admin places GET failed', error)
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const id = String(body.id || '')
    const status = body.status
    if (!id) return NextResponse.json({ error: 'Place id is required' }, { status: 400 })
    if (!['pending', 'verified', 'needs_review', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const patch = {
      status,
      verified: status === 'verified',
      lastVerifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
    }
    const place = await updatePlace(id, patch)
    if (!place) return NextResponse.json({ error: 'Place not found' }, { status: 404 })
    return NextResponse.json({ place })
  } catch (error) {
    console.error('Admin places PATCH failed', error)
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

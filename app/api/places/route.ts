import { NextResponse } from 'next/server'
import { listPlaces } from '../../../database/repository'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const places = await listPlaces({
      q: searchParams.get('q') || undefined,
      province: searchParams.get('province') || undefined,
    })
    return NextResponse.json({ count: places.length, places })
  } catch (error) {
    console.error('Places search failed', error)
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

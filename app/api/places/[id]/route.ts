import { NextResponse } from 'next/server'
import { findPlaceById } from '../../../../database/repository'

const PLACE_ALIASES: Record<string, string> = {
  'calgary-001': '033f5b61-c1d2-5631-a8a2-438ee5ca213a',
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resolvedId = PLACE_ALIASES[id] || id
    const place = await findPlaceById(resolvedId)
    if (!place) return NextResponse.json({ error: 'Buddhist place not found' }, { status: 404 })
    return NextResponse.json({ place })
  } catch (error) {
    console.error('Place detail GET failed', error)
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

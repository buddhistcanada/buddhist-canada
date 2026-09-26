import { NextResponse } from 'next/server'

const places = [
  {
    id: 'calgary-001',
    name: 'Calgary Buddhist Temple',
    city: 'Calgary',
    province: 'Alberta',
    country: 'Canada',
    address: 'Calgary, Alberta',
    email: '',
    phone: '',
    verified: false,
    lastUpdated: '2026-09-26',
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim().toLowerCase()
  const province = (searchParams.get('province') || '').trim().toLowerCase()

  const results = places.filter((place) => {
    const matchesQuery = !q || [
      place.name, place.city, place.province, place.address, place.email, place.phone,
    ].some((value) => value.toLowerCase().includes(q))
    const matchesProvince = !province || place.province.toLowerCase() === province
    return matchesQuery && matchesProvince
  })

  return NextResponse.json({ count: results.length, places: results })
}

import { NextResponse } from 'next/server'
import { createDatabaseClient } from '../../../database/client'
import { ensureDatabaseReady } from '../../../database/bootstrap'

const MAX = { name: 160, address: 300, city: 120, province: 80, postal: 20, phone: 40, email: 254, website: 500, description: 2000 }
const text = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max)
const validEmail = (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const validUrl = (value: string) => !value || /^https?:\/\/[^\s]+$/i.test(value)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = text(body.name, MAX.name)
    const address = text(body.address, MAX.address)
    const city = text(body.city, MAX.city)
    const province = text(body.province_territory, MAX.province)
    const postal = text(body.postal_code, MAX.postal)
    const phone = text(body.phone, MAX.phone)
    const email = text(body.email, MAX.email).toLowerCase()
    const website = text(body.website, MAX.website)
    const description = text(body.description, MAX.description)

    if (!name || !city || !province) return NextResponse.json({ error: 'Name, city and province/territory are required' }, { status: 400 })
    if (!validEmail(email)) return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 })
    if (!validUrl(website)) return NextResponse.json({ error: 'Website must start with http:// or https://' }, { status: 400 })

    const client = createDatabaseClient()
    await client.connect()
    try {
      await ensureDatabaseReady(client)
      const duplicate = await client.query(
        `SELECT id FROM place_submissions WHERE LOWER(name)=LOWER($1) AND LOWER(city)=LOWER($2) AND LOWER(province_territory)=LOWER($3) AND status='pending' LIMIT 1`,
        [name, city, province],
      )
      if (duplicate.rowCount) return NextResponse.json({ error: 'A matching submission is already awaiting review' }, { status: 409 })

      const result = await client.query(
        `INSERT INTO place_submissions
          (name, address, city, province_territory, postal_code, phone, email, website, description, submitted_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING id, name, city, province_territory AS "province", status, created_at AS "createdAt"`,
        [name, address || null, city, province, postal || null, phone || null, email || null, website || null, description || null, null],
      )
      return NextResponse.json({ submission: result.rows[0] }, { status: 201 })
    } finally { await client.end() }
  } catch (error) {
    console.error('Place submission failed', error)
    return NextResponse.json({ error: 'Unable to submit place' }, { status: 503 })
  }
}

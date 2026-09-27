import { NextResponse } from 'next/server'
import { createDatabaseClient } from '../../../database/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const required = ['name', 'city', 'province_territory']
    if (required.some((field) => !String(body[field] || '').trim())) {
      return NextResponse.json({ error: 'Name, city and province/territory are required' }, { status: 400 })
    }

    const client = createDatabaseClient()
    await client.connect()
    try {
      const result = await client.query(
        `INSERT INTO place_submissions
          (name, address, city, province_territory, postal_code, phone, email, website, description, submitted_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING id, name, city, province_territory AS "province", status, created_at AS "createdAt"`,
        [body.name, body.address || null, body.city, body.province_territory, body.postal_code || null, body.phone || null, body.email || null, body.website || null, body.description || null, body.submitted_by || null],
      )
      return NextResponse.json({ submission: result.rows[0] }, { status: 201 })
    } finally {
      await client.end()
    }
  } catch (error) {
    console.error('Place submission failed', error)
    return NextResponse.json({ error: 'Unable to submit place' }, { status: 503 })
  }
}

import { NextResponse } from 'next/server'
import { createDatabaseClient } from '../../../../database/client'

export async function GET() {
  const client = createDatabaseClient()
  await client.connect()
  try {
    const result = await client.query(`SELECT id, name, address, city, province_territory AS province, postal_code AS "postalCode", phone, email, website, description, submitted_by AS "submittedBy", status, reviewed_at AS "reviewedAt", reviewed_by AS "reviewedBy", created_at AS "createdAt" FROM place_submissions WHERE status = 'pending' ORDER BY created_at DESC`)
    return NextResponse.json({ submissions: result.rows })
  } catch (error) {
    console.error('Submission list failed', error)
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  } finally {
    await client.end()
  }
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const id = String(body.id || '')
  const decision = body.status
  const reviewedBy = String(body.reviewed_by || 'admin')
  if (!id || !['approved', 'rejected'].includes(decision)) {
    return NextResponse.json({ error: 'Valid id and approved/rejected status are required' }, { status: 400 })
  }

  const client = createDatabaseClient()
  await client.connect()
  try {
    await client.query('BEGIN')
    const submission = await client.query('SELECT * FROM place_submissions WHERE id = $1 AND status = $2 FOR UPDATE', [id, 'pending'])
    if (!submission.rowCount) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'Pending submission not found' }, { status: 404 })
    }
    const s = submission.rows[0]

    if (decision === 'approved') {
      await client.query(`INSERT INTO buddhist_places (name, address, city, province_territory, postal_code, phone, email, website, description, status, verified, source_name, source_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending',FALSE,'Public submission',NULL)`, [s.name, s.address, s.city, s.province_territory, s.postal_code, s.phone, s.email, s.website, s.description])
    }

    const updated = await client.query(`UPDATE place_submissions SET status=$1, reviewed_at=NOW(), reviewed_by=$2 WHERE id=$3 RETURNING id, status, reviewed_at AS "reviewedAt", reviewed_by AS "reviewedBy"`, [decision, reviewedBy, id])
    await client.query('COMMIT')
    return NextResponse.json({ submission: updated.rows[0] })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Submission review failed', error)
    return NextResponse.json({ error: 'Unable to review submission' }, { status: 503 })
  } finally {
    await client.end()
  }
}

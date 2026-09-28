'use client'

import Link from 'next/link'
import { use, useEffect, useState } from 'react'

const PLACE_ALIASES: Record<string, string> = {
  'calgary-001': '033f5b61-c1d2-5631-a8a2-438ee5ca213a',
}

type Place = {
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
  lastVerifiedAt?: string | Date
  lastUpdatedAt?: string | Date
  sourceName?: string
  sourceUrl?: string
}

function text(value: unknown): string {
  if (value == null) return ''
  if (value instanceof Date) return value.toISOString()
  return String(value)
}

function formatDate(value?: string | Date) {
  if (!value) return 'Not available'
  const raw = value instanceof Date ? value.toISOString() : String(value)
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString('en-CA')
}

export default function PlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [place, setPlace] = useState<Place | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadPlace() {
      try {
        const response = await fetch(`/api/places/${encodeURIComponent(id)}`, { cache: 'no-store' })
        const data = await response.json()
        if (!response.ok) throw new Error(text(data?.error) || 'Unable to load place')
        if (!cancelled) setPlace(data.place as Place)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unable to load place')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void loadPlace()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}><p>Loading place…</p></main>

  if (error || !place) {
    return (
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
        <p><Link href="/places">← Back to Buddhist Places</Link></p>
        <h1>Unable to load this Buddhist place</h1>
        <p>{text(error) || 'Buddhist place not found'}</p>
      </main>
    )
  }

  const isVerified = place.status === 'verified' && place.verified
  const website = text(place.website)
  const email = text(place.email)
  const phone = text(place.phone)
  const mapsUrl = text(place.googleMapsUrl)
  const latitude = typeof place.latitude === 'number' ? place.latitude : Number(place.latitude)
  const longitude = typeof place.longitude === 'number' ? place.longitude : Number(place.longitude)
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude)

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <p><Link href="/places">← Back to Buddhist Places</Link></p>
      <article style={{ marginTop: 24, padding: 28, border: '1px solid #ddd', borderRadius: 14 }}>
        <h1>{text(place.name)}</h1>
        <p>📍 {place.address ? `${text(place.address)}, ` : ''}{text(place.city)}, {text(place.province)} {text(place.postalCode)}</p>
        {phone && <p>📞 <a href={`tel:${phone}`}>{phone}</a></p>}
        {email && <p>📧 <a href={`mailto:${email}`}>{email}</a></p>}
        {website && <p>🌐 <a href={website} target="_blank" rel="noreferrer">Official website</a></p>}
        {place.tradition && <p>🪷 Tradition: {text(place.tradition)}</p>}
        <hr style={{ margin: '24px 0' }} />
        <p><strong>{isVerified ? '✓ Verified Buddhist place' : '⚠ Pending verification'}</strong></p>
        <p style={{ color: isVerified ? '#246b2b' : '#7a5b00' }}>
          {isVerified ? 'This record has been checked by a directory administrator.' : 'Information has not yet been independently verified. Please confirm details with the organization before relying on them.'}
        </p>
        <p>Last updated: {formatDate(place.lastUpdatedAt)}</p>
        {place.lastVerifiedAt && <p>Last verified: {formatDate(place.lastVerifiedAt)}</p>}
        {place.sourceName && <p>Source: {place.sourceUrl ? <a href={text(place.sourceUrl)} target="_blank" rel="noreferrer">{text(place.sourceName)}</a> : text(place.sourceName)}</p>}
        {mapsUrl && <p><a href={mapsUrl} target="_blank" rel="noreferrer">📍 Open in Google Maps</a></p>}
        {hasCoordinates && (
          <div style={{ marginTop: 24, padding: 18, background: '#f7f7f7', borderRadius: 10 }}>
            <strong>Location coordinates</strong>
            <p>{latitude}, {longitude}</p>
          </div>
        )}
      </article>
    </main>
  )
}

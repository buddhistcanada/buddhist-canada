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
  lastVerifiedAt?: string
  lastUpdatedAt?: string
  sourceName?: string
  sourceUrl?: string
}

function formatDate(value?: string) {
  if (!value) return 'Not available'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-CA')
}

export default function PlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const resolvedId = PLACE_ALIASES[id] || id
  const [place, setPlace] = useState<Place | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadPlace() {
      try {
        const response = await fetch(`/api/places/${encodeURIComponent(id)}`, { cache: 'no-store' })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load place')
        if (!cancelled) setPlace(data.place)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unable to load place')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void loadPlace()
    return () => { cancelled = true }
  }, [id, resolvedId])

  if (loading) return <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}><p>Loading place…</p></main>

  if (error || !place) {
    return (
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
        <p><Link href="/places">← Back to Buddhist Places</Link></p>
        <h1>Unable to load this Buddhist place</h1>
        <p>{error || 'Buddhist place not found'}</p>
      </main>
    )
  }

  const isVerified = place.status === 'verified' && place.verified

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <p><Link href="/places">← Back to Buddhist Places</Link></p>
      <article style={{ marginTop: 24, padding: 28, border: '1px solid #ddd', borderRadius: 14 }}>
        <h1>{place.name}</h1>
        <p>📍 {place.address ? `${place.address}, ` : ''}{place.city}, {place.province} {place.postalCode || ''}</p>
        {place.phone && <p>📞 <a href={`tel:${place.phone}`}>{place.phone}</a></p>}
        {place.email && <p>📧 <a href={`mailto:${place.email}`}>{place.email}</a></p>}
        {place.website && <p>🌐 <a href={place.website} target="_blank" rel="noreferrer">Official website</a></p>}
        {place.tradition && <p>🪷 Tradition: {place.tradition}</p>}
        <hr style={{ margin: '24px 0' }} />
        <p><strong>{isVerified ? '✓ Verified Buddhist place' : '⚠ Pending verification'}</strong></p>
        <p style={{ color: isVerified ? '#246b2b' : '#7a5b00' }}>
          {isVerified ? 'This record has been checked by a directory administrator.' : 'Information has not yet been independently verified. Please confirm details with the organization before relying on them.'}
        </p>
        <p>Last updated: {formatDate(place.lastUpdatedAt)}</p>
        {place.lastVerifiedAt && <p>Last verified: {formatDate(place.lastVerifiedAt)}</p>}
        {place.sourceName && <p>Source: {place.sourceUrl ? <a href={place.sourceUrl} target="_blank" rel="noreferrer">{place.sourceName}</a> : place.sourceName}</p>}
        {place.googleMapsUrl && <p><a href={place.googleMapsUrl} target="_blank" rel="noreferrer">📍 Open in Google Maps</a></p>}
        {place.latitude != null && place.longitude != null && (
          <div style={{ marginTop: 24, padding: 18, background: '#f7f7f7', borderRadius: 10 }}>
            <strong>Location coordinates</strong>
            <p>{place.latitude}, {place.longitude}</p>
          </div>
        )}
      </article>
    </main>
  )
}

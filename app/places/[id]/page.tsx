'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

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
  lastUpdatedAt: string
}

export default function PlaceDetailsPage({ params }: { params: { id: string } }) {
  const resolvedId = PLACE_ALIASES[params.id] || params.id
  const [place, setPlace] = useState<Place | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadPlace() {
      try {
        const response = await fetch('/api/places')
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load place')
        const found = (data.places || []).find((item: Place) => item.id === resolvedId)
        if (!found) throw new Error('Buddhist place not found')
        if (!cancelled) setPlace(found)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unable to load place')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadPlace()
    return () => { cancelled = true }
  }, [resolvedId])

  if (loading) {
    return <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}><p>Loading place…</p></main>
  }

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
        <p><strong>{isVerified ? '✓ Verified Buddhist place' : '⏳ Pending verification'}</strong></p>
        <p>Last updated: {place.lastUpdatedAt}</p>
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

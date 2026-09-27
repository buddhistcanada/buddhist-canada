'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Place = {
  id: string; name: string; address?: string; city: string; province: string; postalCode?: string
  tradition?: string; phone?: string; email?: string; website?: string; googleMapsUrl?: string
  verified: boolean; status: 'pending' | 'verified' | 'needs_review' | 'archived'; sourceName?: string; lastUpdatedAt?: string
}

const statusLabel: Record<Place['status'], string> = {
  pending: 'Pending verification', verified: 'Verified', needs_review: 'Needs review', archived: 'Archived'
}

export default function PlacesPage() {
  const [q, setQ] = useState('')
  const [province, setProvince] = useState('')
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function search() {
    setLoading(true); setError('')
    try {
      const params = new URLSearchParams()
      if (q.trim()) params.set('q', q.trim())
      if (province) params.set('province', province)
      const response = await fetch(`/api/places?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Search failed')
      setPlaces(data.places || [])
    } catch (e) { setError(e instanceof Error ? e.message : 'Search failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { void search() }, [])

  const verifiedCount = places.filter(p => p.verified && p.status === 'verified').length

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🇨🇦 Buddhist Places in Canada</h1>
      <p>Browse Buddhist temples, centres, monasteries and societies currently listed in our directory.</p>
      <div style={{ margin: '18px 0', padding: 14, borderRadius: 10, background: '#fff8e6', border: '1px solid #ead9a5' }}>
        <strong>Verification notice:</strong> Information in this directory is collected from listed sources and may not yet have been independently verified. Each place shows its current verification status.
      </div>
      <form onSubmit={e => { e.preventDefault(); void search() }} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '24px 0' }}>
        <input aria-label="Search places" value={q} onChange={e => setQ(e.target.value)} placeholder="Name, city or address" style={{ padding: 10, minWidth: 260 }} />
        <select aria-label="Province" value={province} onChange={e => setProvince(e.target.value)} style={{ padding: 10 }}>
          <option value="">All provinces & territories</option><option>Alberta</option><option>British Columbia</option><option>Manitoba</option><option>New Brunswick</option><option>Newfoundland and Labrador</option><option>Nova Scotia</option><option>Ontario</option><option>Prince Edward Island</option><option>Quebec</option><option>Saskatchewan</option><option>Yukon</option><option>Northwest Territories</option><option>Nunavut</option>
        </select>
        <button type="submit" disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
      </form>
      {!loading && !error && <p><strong>{places.length}</strong> places found · <strong>{verifiedCount}</strong> verified</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && places.length === 0 && <p>No Buddhist places found.</p>}
      <section style={{ display: 'grid', gap: 12 }}>
        {places.map(place => {
          const verified = place.verified && place.status === 'verified'
          return (
            <article key={place.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <h2 style={{ marginTop: 0, marginBottom: 8 }}><Link href={`/places/${place.id}`}>{place.name}</Link></h2>
                <span style={{ padding: '5px 9px', borderRadius: 999, background: verified ? '#e8f5e9' : '#fff3cd', color: verified ? '#246b2b' : '#7a5b00', fontSize: 13, fontWeight: 600 }}>
                  {verified ? '✓ Verified' : `⚠ ${statusLabel[place.status]}`}
                </span>
              </div>
              <p>{place.address ? `${place.address}, ` : ''}{place.city}, {place.province} {place.postalCode || ''}</p>
              {place.tradition && <p>🪷 Tradition: {place.tradition}</p>}
              {place.phone && <p>Phone: {place.phone}</p>}
              {place.email && <p>Email: {place.email}</p>}
              {place.website && <p><a href={place.website} target="_blank" rel="noreferrer">Website</a></p>}
              {place.googleMapsUrl && <p><a href={place.googleMapsUrl} target="_blank" rel="noreferrer">Open in Google Maps</a></p>}
              {place.sourceName && <p style={{ fontSize: 13, color: '#666' }}>Source: {place.sourceName}{place.lastUpdatedAt ? ` · Updated ${new Date(place.lastUpdatedAt).toLocaleDateString('en-CA')}` : ''}</p>}
              <p><Link href={`/places/${place.id}`}>View details →</Link></p>
            </article>
          )
        })}
      </section>
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'

export default function PlacesPage() {
  const [q, setQ] = useState('')
  const [province, setProvince] = useState('')
  const [places, setPlaces] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function search() {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (province) params.set('province', province)
    const response = await fetch(`/api/places?${params.toString()}`)
    const data = await response.json()
    setPlaces(response.ok ? data.places : [])
    setLoading(false)
  }

  useEffect(() => { search() }, [])

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🇨🇦 Buddhist Places in Canada</h1>
      <p>Search verified Buddhist temples, centres and monasteries across Canada.</p>
      <form onSubmit={e => { e.preventDefault(); search() }} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '24px 0' }}>
        <input aria-label="Search places" value={q} onChange={e => setQ(e.target.value)} placeholder="Name, city or address" style={{ padding: 10, minWidth: 260 }} />
        <select aria-label="Province" value={province} onChange={e => setProvince(e.target.value)} style={{ padding: 10 }}>
          <option value="">All provinces</option>
          <option>Alberta</option><option>British Columbia</option><option>Manitoba</option><option>New Brunswick</option><option>Newfoundland and Labrador</option><option>Nova Scotia</option><option>Ontario</option><option>Prince Edward Island</option><option>Quebec</option><option>Saskatchewan</option><option>Yukon</option><option>Northwest Territories</option><option>Nunavut</option>
        </select>
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading…</p>}
      {!loading && places.length === 0 && <p>No verified places found.</p>}
      <section style={{ display: 'grid', gap: 12 }}>
        {places.map(place => (
          <article key={place.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 18 }}>
            <h2>{place.name}</h2>
            <p>{place.address ? `${place.address}, ` : ''}{place.city}, {place.province} {place.postalCode || ''}</p>
            {place.tradition && <p>Tradition: {place.tradition}</p>}
            {place.phone && <p>Phone: {place.phone}</p>}
            {place.email && <p>Email: {place.email}</p>}
            {place.website && <p><a href={place.website} target="_blank" rel="noreferrer">Website</a></p>}
            {place.googleMapsUrl && <p><a href={place.googleMapsUrl} target="_blank" rel="noreferrer">Open in Google Maps</a></p>}
          </article>
        ))}
      </section>
    </main>
  )
}

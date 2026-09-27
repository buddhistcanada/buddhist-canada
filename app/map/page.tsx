'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Place = { id: string; name: string; city: string; province: string; latitude?: number; longitude?: number; googleMapsUrl?: string }

export default function CanadaMapPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/places')
      .then(async response => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load places')
        setPlaces(data.places || [])
      })
      .catch(error => setError(error instanceof Error ? error.message : 'Unable to load places'))
  }, [])

  const mappedPlaces = places.filter(place => place.latitude != null && place.longitude != null)

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <p><Link href="/places">← Buddhist Places</Link></p>
      <h1>🇨🇦 Buddhist Places Map</h1>
      <p>Verified Buddhist places with published coordinates are listed below. Map links open the location in Google Maps.</p>
      {error && <p role="alert">{error}</p>}
      {!error && mappedPlaces.length === 0 && <p>No verified places currently have map coordinates.</p>}
      <section style={{ display: 'grid', gap: 12 }}>
        {mappedPlaces.map(place => (
          <article key={place.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 18 }}>
            <h2><Link href={`/places/${place.id}`}>{place.name}</Link></h2>
            <p>{place.city}, {place.province}</p>
            <p>Coordinates: {place.latitude}, {place.longitude}</p>
            {place.googleMapsUrl && <p><a href={place.googleMapsUrl} target="_blank" rel="noreferrer">Open in Google Maps</a></p>}
          </article>
        ))}
      </section>
    </main>
  )
}

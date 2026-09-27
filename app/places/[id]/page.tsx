import { notFound } from 'next/navigation'
import { listPlaces } from '../../../database/repository'

const PLACE_ALIASES: Record<string, string> = {
  'calgary-001': '033f5b61-c1d2-5631-a8a2-438ee5ca213a',
}

export default async function PlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const resolvedId = PLACE_ALIASES[id] || id
  const places = await listPlaces()
  const place = places.find((item) => item.id === resolvedId)
  if (!place) notFound()

  const isVerified = place.status === 'verified' && place.verified

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <p><a href="/places">← Back to Buddhist Places</a></p>
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

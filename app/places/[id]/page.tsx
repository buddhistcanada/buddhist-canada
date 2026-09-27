import { notFound } from 'next/navigation'
import { listPlaces } from '../../../database/repository'

export default async function PlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const places = await listPlaces()
  const place = places.find((item) => item.id === id && item.status === 'verified' && item.verified)
  if (!place) notFound()

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
        <p><strong>✓ Verified Buddhist place</strong></p>
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

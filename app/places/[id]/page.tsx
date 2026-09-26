import { notFound } from 'next/navigation'
import { samplePlaces } from '../../../data/sample-places'

export default async function PlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const place = samplePlaces.find((item) => item.id === id)
  if (!place) notFound()

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <a href="/search">← Back to search</a>
      <article style={{ marginTop: 24, padding: 28, border: '1px solid #ddd', borderRadius: 14 }}>
        <h1>{place.name}</h1>
        <p>📍 {place.address}{place.city ? `, ${place.city}` : ''}, {place.province} {place.postalCode}</p>
        {place.phone && <p>📞 <a href={`tel:${place.phone}`}>{place.phone}</a></p>}
        {place.email && <p>📧 <a href={`mailto:${place.email}`}>{place.email}</a></p>}
        {place.website && <p>🌐 <a href={place.website}>{place.website}</a></p>}
        {place.tradition && <p>🪷 Tradition: {place.tradition}</p>}

        <hr style={{ margin: '24px 0' }} />
        <p><strong>{place.verified ? '✓ Verified' : 'Pending verification'}</strong></p>
        <p>Last updated: {place.lastUpdated}</p>
        <p>Country: {place.country}</p>

        <div style={{ marginTop: 24, padding: 18, background: '#f7f7f7', borderRadius: 10 }}>
          <strong>Map</strong>
          <p>Map integration will be connected after the location coordinates are verified.</p>
        </div>
      </article>
    </main>
  )
}

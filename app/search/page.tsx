import { samplePlaces } from '../../data/sample-places'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; province?: string }> }) {
  const params = await searchParams
  const q = (params.q ?? '').trim().toLowerCase()
  const province = (params.province ?? '').trim().toLowerCase()

  const results = samplePlaces.filter((place) => {
    const text = [place.name, place.address, place.city, place.province, place.email, place.phone].join(' ').toLowerCase()
    return (!q || text.includes(q)) && (!province || place.province.toLowerCase() === province)
  })

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <a href="/">← Buddhist Canada</a>
      <h1 style={{ marginTop: 24 }}>Buddhist Places</h1>
      <p>{results.length} result{results.length === 1 ? '' : 's'} found.</p>

      {results.length === 0 ? (
        <section style={{ marginTop: 32, padding: 24, border: '1px solid #eee', borderRadius: 14 }}>
          <h2>No places found</h2>
          <p>Try another name, city, province, email or phone number.</p>
        </section>
      ) : (
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          {results.map((place) => (
            <article key={place.id} style={{ padding: 24, border: '1px solid #ddd', borderRadius: 14 }}>
              <h2 style={{ marginTop: 0 }}><a href={`/places/${place.id}`}>{place.name}</a></h2>
              <p>📍 {place.address}{place.city ? `, ${place.city}` : ''}, {place.province}</p>
              {place.phone && <p>📞 {place.phone}</p>}
              {place.email && <p>📧 {place.email}</p>}
              <p>📅 Last updated: {place.lastUpdated} · {place.verified ? '✓ Verified' : 'Pending verification'}</p>
              <a href={`/places/${place.id}`}>View details →</a>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

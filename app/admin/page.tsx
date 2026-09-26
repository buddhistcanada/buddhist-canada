import { verificationSummary, type AdminPlaceRow } from '../../admin/dashboard'

const places: AdminPlaceRow[] = [
  {
    id: 'calgary-001',
    name: 'Calgary Buddhist Temple',
    city: 'Calgary',
    province: 'Alberta',
    status: 'pending',
    lastUpdatedAt: '2026-09-26',
    sourceName: 'Research seed',
    sourceUrl: 'https://www.buddhanet.info/wbd/province.php?province_id=9',
  },
]

export default function AdminPage() {
  const summary = verificationSummary(places)

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <p>🇨🇦 Buddhist Canada / Admin</p>
      <h1>Verification Dashboard</h1>
      <p>Review sources before publishing Buddhist places as verified.</p>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, margin: '28px 0' }}>
        {Object.entries(summary).map(([label, value]) => (
          <div key={label} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 18 }}>
            <strong style={{ display: 'block', textTransform: 'capitalize' }}>{label}</strong>
            <span style={{ fontSize: 28 }}>{value}</span>
          </div>
        ))}
      </section>

      <section>
        <h2>Places awaiting review</h2>
        {places.filter((place) => place.status !== 'archived').map((place) => (
          <article key={place.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 20, marginTop: 12 }}>
            <h3>{place.name}</h3>
            <p>{place.city}, {place.province}</p>
            <p>Status: <strong>{place.status}</strong></p>
            <p>Last updated: {place.lastUpdatedAt}</p>
            <p>Source: <a href={place.sourceUrl} target="_blank" rel="noreferrer">{place.sourceName}</a></p>
            <p>Admin action: verify only after checking the current source and contact details.</p>
          </article>
        ))}
      </section>
    </main>
  )
}

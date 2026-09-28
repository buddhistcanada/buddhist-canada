const provinces = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
  'Prince Edward Island', 'Quebec', 'Saskatchewan',
  'Northwest Territories', 'Nunavut', 'Yukon'
]

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <header>
        <p style={{ fontWeight: 700 }}>🇨🇦 Buddhist Canada</p>
        <h1 style={{ fontSize: 44, margin: '12px 0' }}>Find Buddhist Places Across Canada</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 760 }}>
          Search Buddhist temples, monasteries, meditation centres and Buddhist organizations across every Canadian province and territory.
        </p>
      </header>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
        <a href="/map" style={{ padding: '12px 18px', borderRadius: 10, background: '#111', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>🗺️ View Canada Buddhist Map</a>
        <a href="/places" style={{ padding: '12px 18px', borderRadius: 10, border: '1px solid #bbb', textDecoration: 'none', fontWeight: 700 }}>Browse all places</a>
      </div>

      <form action="/search" method="get" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
        <input
          name="q"
          placeholder="Name, city, address, email or phone"
          aria-label="Search Buddhist places"
          style={{ flex: '1 1 480px', padding: 16, fontSize: 16, border: '1px solid #bbb', borderRadius: 10 }}
        />
        <button type="submit" style={{ padding: '16px 24px', fontSize: 16, border: 0, borderRadius: 10, cursor: 'pointer' }}>
          Search
        </button>
      </form>

      <section style={{ marginTop: 48 }}>
        <h2>Browse by Province or Territory</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
          {provinces.map((province) => (
            <a key={province} href={`/search?province=${encodeURIComponent(province)}`} style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: 999, textDecoration: 'none' }}>
              {province}
            </a>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 48, padding: 24, border: '1px solid #eee', borderRadius: 14 }}>
        <h2>Help keep the directory accurate</h2>
        <p>Place records will show verification and last-updated dates so visitors can see how current the information is.</p>
        <a href="/submit">Submit a Buddhist Place</a>
      </section>
    </main>
  )
}

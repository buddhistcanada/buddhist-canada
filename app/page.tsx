import MapPreview from './components/MapPreview'

const provinces = ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan','Northwest Territories','Nunavut','Yukon']

const mapButtonStyle = { display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px 18px', borderRadius:12, background:'#111', color:'#fff', textDecoration:'none', fontWeight:800, border:'1px solid #111' }
const secondaryButtonStyle = { display:'inline-flex', alignItems:'center', justifyContent:'center', padding:'13px 18px', borderRadius:12, background:'#fff', color:'#111', textDecoration:'none', fontWeight:700, border:'1px solid #bbb' }

export default function HomePage() {
  return (
    <main style={{ maxWidth:1100, margin:'0 auto', padding:'28px 20px 48px', fontFamily:'system-ui, sans-serif' }}>
      <header>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
          <p style={{ fontWeight:800, margin:0 }}>🇨🇦 Buddhist Canada</p>
          <nav aria-label="Primary navigation" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <a href="/map" style={mapButtonStyle}>🗺️ Map</a>
            <a href="/places" style={secondaryButtonStyle}>Browse places</a>
          </nav>
        </div>
        <h1 style={{ fontSize:44, margin:'28px 0 12px' }}>Find Buddhist Places Across Canada</h1>
        <p style={{ fontSize:18, lineHeight:1.6, maxWidth:760 }}>Search Buddhist temples, monasteries, meditation centres and Buddhist organizations across every Canadian province and territory.</p>
      </header>

      <MapPreview />

      <section aria-label="Map and directory" style={{ marginTop:28, padding:22, borderRadius:16, border:'1px solid #ddd', background:'#fafafa' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:18, flexWrap:'wrap' }}>
          <div><h2 style={{ margin:'0 0 6px' }}>🗺️ Explore the Buddhist Canada Map</h2><p style={{ margin:0, lineHeight:1.5 }}>Open the full interactive map to filter by province, inspect markers and view place details.</p></div>
          <a href="/map" style={{ ...mapButtonStyle, whiteSpace:'nowrap' }}>Open full map →</a>
        </div>
      </section>

      <form action="/search" method="get" style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:32 }}>
        <input name="q" placeholder="Name, city, address, email or phone" aria-label="Search Buddhist places" style={{ flex:'1 1 480px', padding:16, fontSize:16, border:'1px solid #bbb', borderRadius:10 }} />
        <button type="submit" style={{ padding:'16px 24px', fontSize:16, border:0, borderRadius:10, cursor:'pointer' }}>Search</button>
      </form>

      <section style={{ marginTop:48 }}><h2>Browse by Province or Territory</h2><div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:16 }}>{provinces.map(province => <a key={province} href={`/search?province=${encodeURIComponent(province)}`} style={{ padding:'10px 14px', border:'1px solid #ddd', borderRadius:999, textDecoration:'none' }}>{province}</a>)}</div></section>
      <section style={{ marginTop:48, padding:24, border:'1px solid #eee', borderRadius:14 }}><h2>Help keep the directory accurate</h2><p>Place records will show verification and last-updated dates so visitors can see how current the information is.</p><a href="/submit">Submit a Buddhist Place</a></section>
    </main>
  )
}

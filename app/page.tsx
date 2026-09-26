export default function HomePage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 32 }}>
      <header>
        <p>Buddhist Canada</p>
        <h1>Find Buddhist Places Across Canada</h1>
        <p>Search Buddhist temples, monasteries, meditation centres and Buddhist organizations.</p>
      </header>

      <form action="/search" style={{ display: 'grid', gap: 12, marginTop: 32 }}>
        <input
          name="q"
          placeholder="Search by name, city, address, email or phone"
          aria-label="Search Buddhist places"
          style={{ padding: 14, fontSize: 16 }}
        />
        <button type="submit" style={{ padding: 14, fontSize: 16 }}>Search</button>
      </form>

      <section style={{ marginTop: 40 }}>
        <h2>Browse Canada</h2>
        <p>Alberta · British Columbia · Manitoba · New Brunswick · Newfoundland and Labrador · Nova Scotia · Ontario · Prince Edward Island · Quebec · Saskatchewan · Northwest Territories · Nunavut · Yukon</p>
      </section>
    </main>
  )
}

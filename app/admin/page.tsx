'use client'

import { useEffect, useState } from 'react'

type Submission = {
  id: string
  name: string
  address?: string
  city: string
  province: string
  phone?: string
  email?: string
  website?: string
  description?: string
  status: string
  createdAt: string
}

type Place = { id: string; name: string; city: string; province: string; status: string; lastUpdatedAt: string; sourceName: string; sourceUrl: string }

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [error, setError] = useState('')

  async function load() {
    setError('')
    const [s, p] = await Promise.all([fetch('/api/admin/submissions'), fetch('/api/admin/places')])
    if (!s.ok || !p.ok) { setError('Unable to load admin data.'); return }
    setSubmissions((await s.json()).submissions)
    setPlaces((await p.json()).places)
  }

  useEffect(() => { load() }, [])

  async function review(id: string, status: 'approved' | 'rejected') {
    const response = await fetch('/api/admin/submissions', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, reviewed_by: 'admin' }),
    })
    if (!response.ok) { setError('Review action failed.'); return }
    await load()
  }

  async function verify(id: string) {
    const response = await fetch('/api/admin/places', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'verified' }),
    })
    if (!response.ok) { setError('Verification failed.'); return }
    await load()
  }

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <p>🇨🇦 Buddhist Canada / Admin</p>
      <h1>Verification Dashboard</h1>
      {error && <p role="alert">{error}</p>}

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, margin: '28px 0' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 18 }}>Pending submissions: <strong>{submissions.length}</strong></div>
        <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 18 }}>Places: <strong>{places.length}</strong></div>
        <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 18 }}>Verified: <strong>{places.filter(p => p.status === 'verified').length}</strong></div>
      </section>

      <h2>Pending submissions</h2>
      {submissions.length === 0 && <p>No pending submissions.</p>}
      {submissions.map(s => (
        <article key={s.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 20, marginTop: 12 }}>
          <h3>{s.name}</h3><p>{s.city}, {s.province}</p>
          {s.address && <p>{s.address}</p>}
          {s.phone && <p>Phone: {s.phone}</p>}
          {s.email && <p>Email: {s.email}</p>}
          {s.website && <p>Website: {s.website}</p>}
          {s.description && <p>{s.description}</p>}
          <button onClick={() => review(s.id, 'approved')}>Approve for verification</button>{' '}
          <button onClick={() => review(s.id, 'rejected')}>Reject</button>
        </article>
      ))}

      <h2 style={{ marginTop: 40 }}>Places requiring verification</h2>
      {places.filter(p => p.status !== 'archived').map(p => (
        <article key={p.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 20, marginTop: 12 }}>
          <h3>{p.name}</h3><p>{p.city}, {p.province}</p>
          <p>Status: <strong>{p.status}</strong></p>
          <p>Source: <a href={p.sourceUrl} target="_blank" rel="noreferrer">{p.sourceName}</a></p>
          {p.status !== 'verified' && <button onClick={() => verify(p.id)}>Verify after source check</button>}
        </article>
      ))}
    </main>
  )
}

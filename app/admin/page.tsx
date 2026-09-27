'use client'

import { useEffect, useState } from 'react'

type Submission = { id: string; name: string; address?: string; city: string; province: string; phone?: string; email?: string; website?: string; description?: string; status: string; createdAt: string }
type Place = { id: string; name: string; city: string; province: string; status: string; lastUpdatedAt: string; sourceName: string; sourceUrl: string }

export default function AdminPage() {
  const [key, setKey] = useState('')
  const [saved, setSaved] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [error, setError] = useState('')

  async function load(adminKey = key) {
    setError('')
    const headers = { 'x-admin-api-key': adminKey }
    const [s, p] = await Promise.all([fetch('/api/admin/submissions', { headers }), fetch('/api/admin/places', { headers })])
    if (!s.ok || !p.ok) { setError('Unauthorized or unable to load admin data.'); return }
    setSubmissions((await s.json()).submissions || [])
    setPlaces((await p.json()).places || [])
    setSaved(true)
  }

  useEffect(() => { const existing = sessionStorage.getItem('buddhist-canada-admin-key'); if (existing) { setKey(existing); void load(existing) } }, [])

  async function login(event: React.FormEvent) { event.preventDefault(); sessionStorage.setItem('buddhist-canada-admin-key', key); await load(key) }

  async function review(id: string, status: 'approved' | 'rejected') {
    const response = await fetch('/api/admin/submissions', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-api-key': key }, body: JSON.stringify({ id, status, reviewed_by: 'admin' }) })
    if (!response.ok) { setError('Review action failed.'); return }
    await load()
  }

  async function verify(id: string) {
    const response = await fetch('/api/admin/places', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-api-key': key }, body: JSON.stringify({ id, status: 'verified' }) })
    if (!response.ok) { setError('Verification failed.'); return }
    await load()
  }

  if (!saved) return <main style={{ maxWidth: 520, margin: '80px auto', padding: 20, fontFamily: 'system-ui, sans-serif' }}><h1>🇨🇦 Buddhist Canada Admin</h1><form onSubmit={login}><label>Admin API key<input type="password" value={key} onChange={e => setKey(e.target.value)} required style={{ display: 'block', width: '100%', padding: 10, margin: '8px 0 12px' }} /></label><button type="submit">Sign in</button>{error && <p role="alert">{error}</p>}</form></main>

  return <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
    <p>🇨🇦 Buddhist Canada / Admin</p><h1>Verification Dashboard</h1>{error && <p role="alert">{error}</p>}
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, margin: '28px 0' }}><div>Pending: <strong>{submissions.length}</strong></div><div>Places: <strong>{places.length}</strong></div><div>Verified: <strong>{places.filter(p => p.status === 'verified').length}</strong></div></section>
    <h2>Pending submissions</h2>{submissions.length === 0 && <p>No pending submissions.</p>}{submissions.map(s => <article key={s.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 20, marginTop: 12 }}><h3>{s.name}</h3><p>{s.city}, {s.province}</p>{s.address && <p>{s.address}</p>}{s.phone && <p>Phone: {s.phone}</p>}{s.email && <p>Email: {s.email}</p>}{s.website && <p>Website: {s.website}</p>}{s.description && <p>{s.description}</p>}<button onClick={() => review(s.id, 'approved')}>Approve</button>{' '}<button onClick={() => review(s.id, 'rejected')}>Reject</button></article>)}
    <h2 style={{ marginTop: 40 }}>Places requiring verification</h2>{places.filter(p => p.status !== 'archived').map(p => <article key={p.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 20, marginTop: 12 }}><h3>{p.name}</h3><p>{p.city}, {p.province}</p><p>Status: <strong>{p.status}</strong></p>{p.sourceUrl && <p>Source: <a href={p.sourceUrl} target="_blank" rel="noreferrer">{p.sourceName}</a></p>}{p.status !== 'verified' && <button onClick={() => verify(p.id)}>Verify</button>}</article>)}
  </main>
}

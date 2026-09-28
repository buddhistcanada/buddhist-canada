'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type Place = { id: string; name: string; city: string; province: string; latitude?: number; longitude?: number; googleMapsUrl?: string; verified: boolean; status: string; sourceName?: string }

const cityCoordinates: Record<string, [number, number]> = {
  Calgary: [51.0447, -114.0719], Edmonton: [53.5461, -113.4938], Lethbridge: [49.6956, -112.8451], Red Deer: [52.2681, -113.8112], Vancouver: [49.2827, -123.1207], Burnaby: [49.2488, -122.9805], Richmond: [49.1666, -123.1336], Surrey: [49.1913, -122.8490], Victoria: [48.4284, -123.3656], Kelowna: [49.8880, -119.4960], Toronto: [43.6532, -79.3832], Mississauga: [43.5890, -79.6441], Markham: [43.8561, -79.3370], Ottawa: [45.4215, -75.6972], Montreal: [45.5019, -73.5674], Laval: [45.6066, -73.7124], Winnipeg: [49.8951, -97.1384], Regina: [50.4452, -104.6189], Saskatoon: [52.1332, -106.6700], Halifax: [44.6488, -63.5752], Fredericton: [45.9636, -66.6431], SaintJohn: [45.2733, -66.0633], StJohns: [47.5615, -52.7126], Charlottetown: [46.2382, -63.1311], Whitehorse: [60.7212, -135.0568], Yellowknife: [62.4540, -114.3718], Iqaluit: [63.7467, -68.5170]
}

const provinceCoordinates: Record<string, [number, number]> = {
  Alberta: [53.9333, -116.5765], 'British Columbia': [53.7267, -127.6476], Manitoba: [53.7609, -98.8139], Saskatchewan: [52.9399, -106.4509], Ontario: [51.2538, -85.3232], Quebec: [52.9399, -73.5491], 'Nova Scotia': [44.6820, -63.7443], 'New Brunswick': [46.5653, -66.4619], 'Newfoundland and Labrador': [53.1355, -57.6604], 'Prince Edward Island': [46.5107, -63.4168], Yukon: [64.2823, -135.0000], 'Northwest Territories': [64.8255, -124.8457], Nunavut: [70.2998, -83.1076]
}

function coords(place: Place): { lat: number; lon: number; approximate: boolean } {
  if (place.latitude != null && place.longitude != null) return { lat: place.latitude, lon: place.longitude, approximate: false }
  const cityKey = place.city.replace(/[^A-Za-z]/g, '')
  const city = cityCoordinates[place.city] || cityCoordinates[cityKey]
  if (city) return { lat: city[0], lon: city[1], approximate: true }
  const province = provinceCoordinates[place.province] || [56.1304, -106.3468]
  return { lat: province[0], lon: province[1], approximate: true }
}

function project(lat: number, lon: number) {
  const west = -141, east = -52, north = 84, south = 41
  const x = ((lon - west) / (east - west)) * 100
  const merc = (v: number) => Math.log(Math.tan(Math.PI / 4 + (v * Math.PI / 180) / 2))
  const y = ((merc(north) - merc(lat)) / (merc(north) - merc(south))) * 100
  return { left: Math.max(0.5, Math.min(99.5, x)), top: Math.max(1, Math.min(99, y)) }
}

export default function CanadaMapPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [province, setProvince] = useState('All')

  useEffect(() => {
    fetch('/api/places')
      .then(async response => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load places')
        setPlaces(data.places || [])
      })
      .catch(error => setError(error instanceof Error ? error.message : 'Unable to load places'))
  }, [])

  const filtered = useMemo(() => province === 'All' ? places : places.filter(p => p.province === province), [places, province])
  const provinces = useMemo(() => ['All', ...Array.from(new Set(places.map(p => p.province))).sort()], [places])
  const selectedPlace = places.find(p => p.id === selected)

  return (
    <main style={{ maxWidth: 1250, margin: '0 auto', padding: '24px 16px 48px', fontFamily: 'system-ui, sans-serif' }}>
      <p><Link href="/places">← Buddhist Places</Link></p>
      <h1>🇨🇦 Buddhist Places — Interactive Map</h1>
      <p>All directory records are shown. A marker based on a city/province is labelled <strong>Approx.</strong> until an exact location is verified. This prevents unverified addresses from being presented as exact map coordinates.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <label>Province: <select value={province} onChange={e => setProvince(e.target.value)}>{provinces.map(p => <option key={p}>{p}</option>)}</select></label>
        <span style={{ padding: '6px 10px', borderRadius: 999, background: '#f3f4f6' }}>{filtered.length} places</span>
        <span style={{ padding: '6px 10px', borderRadius: 999, background: '#fff7ed' }}>{filtered.filter(p => !p.verified).length} pending verification</span>
      </div>
      {error && <p role="alert">{error}</p>}
      {!error && (
        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', gap: 16 }}>
          <div style={{ position: 'relative', minHeight: 560, overflow: 'hidden', borderRadius: 16, border: '1px solid #d1d5db', background: '#e5e7eb' }}>
            <iframe title="OpenStreetMap Canada" src="https://www.openstreetmap.org/export/embed.html?bbox=-141%2C41%2C-52%2C84&layer=mapnik" style={{ width: '100%', height: '100%', minHeight: 560, border: 0 }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {filtered.map(place => {
                const c = coords(place); const pos = project(c.lat, c.lon); const active = selected === place.id
                return <button key={place.id} title={`${place.name} — ${place.city}`} onClick={() => setSelected(place.id)} style={{ position: 'absolute', left: `${pos.left}%`, top: `${pos.top}%`, transform: 'translate(-50%,-50%)', width: active ? 22 : 16, height: active ? 22 : 16, borderRadius: '50%', border: '2px solid white', background: place.verified ? '#166534' : '#b45309', boxShadow: '0 1px 5px rgba(0,0,0,.45)', cursor: 'pointer', pointerEvents: 'auto', zIndex: active ? 5 : 2 }} />
              })}
            </div>
            <div style={{ position: 'absolute', left: 12, bottom: 12, background: 'rgba(255,255,255,.94)', borderRadius: 10, padding: 10, fontSize: 12 }}>
              <div>🟢 Verified</div><div>🟠 Pending / unverified</div><div>“Approx.” = city/province location, not exact address</div>
            </div>
          </div>
          <aside style={{ border: '1px solid #ddd', borderRadius: 16, padding: 16, maxHeight: 560, overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0 }}>Places</h2>
            {filtered.map(place => {
              const c = coords(place)
              return <article key={place.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <button onClick={() => setSelected(place.id)} style={{ border: 0, background: 'transparent', padding: 0, textAlign: 'left', cursor: 'pointer', width: '100%' }}>
                  <strong>{place.name}</strong><br />{place.city}, {place.province} {c.approximate && <small>• Approx.</small>}<br />
                  <small>{place.verified ? 'Verified' : 'Pending verification'}{place.sourceName ? ` • ${place.sourceName}` : ''}</small>
                </button>
                <div style={{ marginTop: 5 }}><Link href={`/places/${place.id}`}>View details</Link></div>
              </article>
            })}
          </aside>
        </section>
      )}
      {selectedPlace && <section style={{ marginTop: 16, padding: 16, border: '2px solid #d1d5db', borderRadius: 16 }}><h2>{selectedPlace.name}</h2><p>{selectedPlace.city}, {selectedPlace.province}</p><p>{selectedPlace.verified ? 'Verified' : 'Pending verification'}</p><Link href={`/places/${selectedPlace.id}`}>Open full details →</Link></section>}
      <p style={{ marginTop: 20, fontSize: 13, color: '#555' }}>The World Buddhist Directory currently reports 361 Canada results; its records can be historical or incomplete, so this site deliberately keeps source records visibly unverified until independently checked. citeturn0search3turn2search8</p>
    </main>
  )
}

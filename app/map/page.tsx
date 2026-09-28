'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Place = {
  id: string
  name: string
  city: string
  province: string
  latitude?: number
  longitude?: number
  googleMapsUrl?: string
  verified: boolean
  status: string
  sourceName?: string
}

type MarkerHandle = { remove: () => void }

const cityCoordinates: Record<string, [number, number]> = {
  Calgary: [51.0447, -114.0719], Edmonton: [53.5461, -113.4938], Lethbridge: [49.6956, -112.8451], 'Red Deer': [52.2681, -113.8112],
  Vancouver: [49.2827, -123.1207], Burnaby: [49.2488, -122.9805], Richmond: [49.1666, -123.1336], Surrey: [49.1913, -122.8490], Victoria: [48.4284, -123.3656], Kelowna: [49.8880, -119.4960],
  Toronto: [43.6532, -79.3832], Mississauga: [43.5890, -79.6441], Markham: [43.8561, -79.3370], Ottawa: [45.4215, -75.6972], Montreal: [45.5019, -73.5674], Laval: [45.6066, -73.7124],
  Winnipeg: [49.8951, -97.1384], Regina: [50.4452, -104.6189], Saskatoon: [52.1332, -106.6700], Halifax: [44.6488, -63.5752], Fredericton: [45.9636, -66.6431], SaintJohn: [45.2733, -66.0633],
  StJohns: [47.5615, -52.7126], Charlottetown: [46.2382, -63.1311], Whitehorse: [60.7212, -135.0568], Yellowknife: [62.4540, -114.3718], Iqaluit: [63.7467, -68.5170]
}

const provinceCoordinates: Record<string, [number, number]> = {
  Alberta: [53.9333, -116.5765], 'British Columbia': [53.7267, -127.6476], Manitoba: [53.7609, -98.8139], Saskatchewan: [52.9399, -106.4509], Ontario: [51.2538, -85.3232], Quebec: [52.9399, -73.5491],
  'Nova Scotia': [44.6820, -63.7443], 'New Brunswick': [46.5653, -66.4619], 'Newfoundland and Labrador': [53.1355, -57.6604], 'Prince Edward Island': [46.5107, -63.4168],
  Yukon: [64.2823, -135.0000], 'Northwest Territories': [64.8255, -124.8457], Nunavut: [70.2998, -83.1076]
}

function coords(place: Place) {
  if (place.latitude != null && place.longitude != null && Number.isFinite(place.latitude) && Number.isFinite(place.longitude)) {
    return { lat: place.latitude, lon: place.longitude, approximate: false }
  }
  const cityKey = place.city.replace(/[^A-Za-z]/g, '')
  const city = cityCoordinates[place.city] || cityCoordinates[cityKey]
  if (city) return { lat: city[0], lon: city[1], approximate: true }
  const province = provinceCoordinates[place.province] || [56.1304, -106.3468]
  return { lat: province[0], lon: province[1], approximate: true }
}

export default function CanadaMapPage() {
  const mapNode = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markersRef = useRef<MarkerHandle[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [province, setProvince] = useState('All')
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    fetch('/api/places', { cache: 'no-store' })
      .then(async response => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load places')
        setPlaces(Array.isArray(data.places) ? data.places : [])
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Unable to load places'))
  }, [])

  useEffect(() => {
    let cancelled = false
    async function init() {
      if (!mapNode.current || mapRef.current) return
      const L = await import('leaflet')
      if (cancelled || !mapNode.current) return
      const map = L.map(mapNode.current, { scrollWheelZoom: true, preferCanvas: true }).setView([56.1304, -106.3468], 3.2)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)
      mapRef.current = map
      setMapReady(true)
      window.setTimeout(() => map.invalidateSize(), 100)
    }
    init().catch(err => setError(err instanceof Error ? err.message : 'Unable to initialize map'))
    return () => {
      cancelled = true
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  const filtered = useMemo(() => province === 'All' ? places : places.filter(p => p.province === province), [places, province])
  const provinces = useMemo(() => ['All', ...Array.from(new Set(places.map(p => p.province))).sort()], [places])
  const selectedPlace = places.find(p => p.id === selected)

  useEffect(() => {
    if (!mapRef.current || !mapReady) return
    let alive = true
    async function renderMarkers() {
      const L = await import('leaflet')
      if (!alive || !mapRef.current) return
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      const bounds: [number, number][] = []
      for (const place of filtered) {
        const c = coords(place)
        bounds.push([c.lat, c.lon])
        const color = place.verified ? '#166534' : '#b45309'
        const marker = L.circleMarker([c.lat, c.lon], {
          radius: place.verified ? 8 : 7,
          color: '#ffffff',
          weight: 2,
          fillColor: color,
          fillOpacity: 0.95,
        }).addTo(mapRef.current)
        const approx = c.approximate ? '<div style="color:#92400e;margin-top:4px"><strong>Approximate location</strong> — city/province only</div>' : ''
        marker.bindPopup(`<strong>${escapeHtml(place.name)}</strong><br>${escapeHtml(place.city)}, ${escapeHtml(place.province)}${approx}<br><small>${place.verified ? 'Verified' : 'Pending verification'}</small><br><a href="/places/${encodeURIComponent(place.id)}">View details</a>`)
        marker.on('click', () => setSelected(place.id))
        markersRef.current.push(marker)
      }
      if (bounds.length > 0) mapRef.current.fitBounds(bounds, { padding: [28, 28], maxZoom: 6 })
      else mapRef.current.setView([56.1304, -106.3468], 3.2)
    }
    renderMarkers().catch(() => setError('Unable to render map markers'))
    return () => { alive = false }
  }, [filtered, mapReady])

  return (
    <main style={{ maxWidth: 1250, margin: '0 auto', padding: '24px 16px 48px', fontFamily: 'system-ui, sans-serif' }}>
      <p><Link href="/places">← Buddhist Places</Link></p>
      <h1>🇨🇦 Buddhist Places — Interactive Map</h1>
      <p>Every directory record can be shown. Exact coordinates are used only when present in the database; otherwise the marker is explicitly approximate at city/province level. Records remain visibly pending until independently verified.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
        <label>Province: <select value={province} onChange={e => setProvince(e.target.value)}>{provinces.map(p => <option key={p}>{p}</option>)}</select></label>
        <span style={{ padding: '6px 10px', borderRadius: 999, background: '#f3f4f6' }}>{filtered.length} places</span>
        <span style={{ padding: '6px 10px', borderRadius: 999, background: '#fff7ed' }}>{filtered.filter(p => !p.verified).length} pending verification</span>
      </div>
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', gap: 16 }}>
        <div ref={mapNode} aria-label="Interactive map of Buddhist places across Canada" style={{ minHeight: 600, width: '100%', borderRadius: 16, border: '1px solid #d1d5db', overflow: 'hidden', background: '#e5e7eb' }} />
        <aside style={{ border: '1px solid #ddd', borderRadius: 16, padding: 16, maxHeight: 600, overflowY: 'auto' }}>
          <h2 style={{ marginTop: 0 }}>Places</h2>
          {filtered.map(place => {
            const c = coords(place)
            return <article key={place.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <button onClick={() => { setSelected(place.id); const map = mapRef.current; if (map) map.setView([c.lat, c.lon], Math.max(map.getZoom(), c.approximate ? 7 : 13)) }} style={{ border: 0, background: 'transparent', padding: 0, textAlign: 'left', cursor: 'pointer', width: '100%' }}>
                <strong>{place.name}</strong><br />{place.city}, {place.province} {c.approximate && <small>• Approx.</small>}<br />
                <small>{place.verified ? 'Verified' : 'Pending verification'}{place.sourceName ? ` • ${place.sourceName}` : ''}</small>
              </button>
              <div style={{ marginTop: 5 }}><Link href={`/places/${place.id}`}>View details</Link></div>
            </article>
          })}
        </aside>
      </section>
      <div style={{ marginTop: 12, fontSize: 13, color: '#555' }}>🟢 Verified &nbsp; 🟠 Pending/unverified &nbsp; • &nbsp; Approx. means the marker is not an exact address.</div>
      {selectedPlace && <section style={{ marginTop: 16, padding: 16, border: '2px solid #d1d5db', borderRadius: 16 }}><h2>{selectedPlace.name}</h2><p>{selectedPlace.city}, {selectedPlace.province}</p><p>{selectedPlace.verified ? 'Verified' : 'Pending verification'}</p><Link href={`/places/${selectedPlace.id}`}>Open full details →</Link></section>}
    </main>
  )
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] || char))
}

'use client'

import { useEffect, useRef, useState } from 'react'
import type { Map as LeafletMap, CircleMarker } from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Place = {
  id: string
  name: string
  city: string
  province: string
  latitude?: number
  longitude?: number
  verified: boolean
}

const cityCoordinates: Record<string, [number, number]> = {
  Calgary: [51.0447, -114.0719], Edmonton: [53.5461, -113.4938], Lethbridge: [49.6956, -112.8451],
  Vancouver: [49.2827, -123.1207], Burnaby: [49.2488, -122.9805], Richmond: [49.1666, -123.1336],
  Surrey: [49.1913, -122.8490], Victoria: [48.4284, -123.3656], Kelowna: [49.8880, -119.4960],
  Toronto: [43.6532, -79.3832], Mississauga: [43.5890, -79.6441], Markham: [43.8561, -79.3370],
  Ottawa: [45.4215, -75.6972], Montreal: [45.5019, -73.5674], Winnipeg: [49.8951, -97.1384],
  Regina: [50.4452, -104.6189], Saskatoon: [52.1332, -106.6700], Halifax: [44.6488, -63.5752],
  Fredericton: [45.9636, -66.6431], StJohns: [47.5615, -52.7126], Charlottetown: [46.2382, -63.1311],
  Whitehorse: [60.7212, -135.0568], Yellowknife: [62.4540, -114.3718], Iqaluit: [63.7467, -68.5170],
}

const provinceCoordinates: Record<string, [number, number]> = {
  Alberta: [53.9333, -116.5765], 'British Columbia': [53.7267, -127.6476], Manitoba: [53.7609, -98.8139],
  Saskatchewan: [52.9399, -106.4509], Ontario: [51.2538, -85.3232], Quebec: [52.9399, -73.5491],
  'Nova Scotia': [44.6820, -63.7443], 'New Brunswick': [46.5653, -66.4619],
  'Newfoundland and Labrador': [53.1355, -57.6604], 'Prince Edward Island': [46.5107, -63.4168],
  Yukon: [64.2823, -135.0000], 'Northwest Territories': [64.8255, -124.8457], Nunavut: [70.2998, -83.1076],
}

function getCoordinates(place: Place) {
  if (Number.isFinite(place.latitude) && Number.isFinite(place.longitude)) {
    return { lat: place.latitude as number, lon: place.longitude as number, approximate: false }
  }
  const city = cityCoordinates[place.city] ?? cityCoordinates[place.city.replace(/[^A-Za-z]/g, '')]
  if (city) return { lat: city[0], lon: city[1], approximate: true }
  const province = provinceCoordinates[place.province] ?? [56.1304, -106.3468]
  return { lat: province[0], lon: province[1], approximate: true }
}

export default function MapPreview() {
  const nodeRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markersRef = useRef<CircleMarker[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [error, setError] = useState('')

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
      if (!nodeRef.current || mapRef.current) return
      const L = await import('leaflet')
      if (cancelled || !nodeRef.current) return
      const map = L.map(nodeRef.current, { scrollWheelZoom: false, zoomControl: true, preferCanvas: true }).setView([56.1304, -106.3468], 3.2)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)
      mapRef.current = map
      window.setTimeout(() => map.invalidateSize(), 100)
    }
    init().catch(() => setError('Unable to initialize map'))
    return () => {
      cancelled = true
      markersRef.current.forEach(marker => marker.remove())
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || places.length === 0) return
    let alive = true
    async function render() {
      const L = await import('leaflet')
      if (!alive || !mapRef.current) return
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      const bounds: [number, number][] = []
      for (const place of places) {
        const c = getCoordinates(place)
        bounds.push([c.lat, c.lon])
        const marker = L.circleMarker([c.lat, c.lon], {
          radius: place.verified ? 7 : 6,
          color: '#fff', weight: 2,
          fillColor: place.verified ? '#16805b' : '#d97706',
          fillOpacity: 0.95,
        }).addTo(mapRef.current)
        marker.bindPopup(`<strong>${escapeHtml(place.name)}</strong><br>${escapeHtml(place.city)}, ${escapeHtml(place.province)}<br><small>${place.verified ? 'Verified' : 'Pending verification'}${c.approximate ? ' · Approximate location' : ''}</small><br><a href="/places/${encodeURIComponent(place.id)}">View details →</a>`)
        markersRef.current.push(marker)
      }
      if (bounds.length) mapRef.current.fitBounds(bounds, { padding: [24, 24], maxZoom: 6 })
    }
    render().catch(() => setError('Unable to render map markers'))
    return () => { alive = false }
  }, [places])

  return (
    <section aria-label="Live Buddhist places map" style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div>
          <span style={{ display: 'inline-block', padding: '5px 10px', borderRadius: 999, background: '#dcfce7', color: '#16805b', fontWeight: 800 }}>Map view</span>
          <h2 style={{ margin: '10px 0 2px' }}>Explore Buddhist places</h2>
          <p style={{ margin: 0, color: '#555' }}>Live directory locations across Canada</p>
        </div>
        <a href="/map" style={{ fontWeight: 800, color: '#16805b' }}>Full map →</a>
      </div>
      <div style={{ position: 'relative', height: 430, borderRadius: 18, overflow: 'hidden', border: '1px solid #d8e2da', background: '#e8f1eb' }}>
        <div ref={nodeRef} style={{ height: '100%', width: '100%' }} />
        <div style={{ position: 'absolute', left: 12, bottom: 12, zIndex: 500, padding: '7px 10px', borderRadius: 10, background: 'rgba(255,255,255,.92)', fontSize: 12, boxShadow: '0 1px 5px rgba(0,0,0,.15)' }}>
          🟢 Verified &nbsp; 🟠 Pending / unverified
        </div>
      </div>
      {error && <p style={{ color: '#b91c1c', fontSize: 13 }}>{error}</p>}
      <p style={{ marginTop: 8, color: '#666', fontSize: 12 }}>Markers without verified coordinates are shown at city/province level and clearly marked approximate.</p>
    </section>
  )
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] || char))
}

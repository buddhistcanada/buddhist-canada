import type { Metadata } from 'next'
import './globals.css'
import 'leaflet/dist/leaflet.css'

export const metadata: Metadata = {
  title: 'Buddhist Canada',
  description: 'Canada-wide directory of Buddhist temples, monasteries, meditation centres and Buddhist organizations.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>{children}</body>
    </html>
  )
}

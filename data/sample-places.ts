export type BuddhistPlace = {
  id: string
  name: string
  address: string
  city: string
  province: string
  postalCode: string
  country: 'Canada'
  phone: string
  email: string
  website?: string
  tradition?: string
  verified: boolean
  lastUpdated: string
}

export const samplePlaces: BuddhistPlace[] = [
  {
    id: 'calgary-001',
    name: 'Calgary Buddhist Temple',
    address: 'Calgary, Alberta',
    city: 'Calgary',
    province: 'Alberta',
    postalCode: '',
    country: 'Canada',
    phone: '',
    email: '',
    tradition: 'Buddhist',
    verified: false,
    lastUpdated: '2026-09-26',
  },
]

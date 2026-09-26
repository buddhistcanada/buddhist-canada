import { canPublishAsVerified, type VerificationRecord } from './verification'

export type AdminPlaceRow = {
  id: string
  name: string
  city: string
  province: string
  status: VerificationRecord['status']
  lastVerifiedAt?: string
  lastUpdatedAt: string
  sourceName: string
  sourceUrl: string
}

export function verificationSummary(places: AdminPlaceRow[]) {
  return {
    total: places.length,
    pending: places.filter((p) => p.status === 'pending').length,
    verified: places.filter((p) => p.status === 'verified').length,
    needsReview: places.filter((p) => p.status === 'needs_review').length,
    archived: places.filter((p) => p.status === 'archived').length,
  }
}

export function verifyPlace(place: AdminPlaceRow, checkedBy: string, notes?: string) {
  const record: VerificationRecord = {
    placeId: place.id,
    status: 'verified',
    sourceName: place.sourceName,
    sourceUrl: place.sourceUrl,
    checkedAt: new Date().toISOString(),
    checkedBy,
    notes,
  }

  if (!canPublishAsVerified(record)) {
    throw new Error('A reliable source and verification details are required before publishing as verified.')
  }

  return {
    ...place,
    status: 'verified' as const,
    lastVerifiedAt: record.checkedAt,
  }
}

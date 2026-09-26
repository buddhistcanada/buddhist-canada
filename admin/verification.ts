export type VerificationStatus = 'pending' | 'verified' | 'needs_review' | 'archived'

export type VerificationRecord = {
  placeId: string
  status: VerificationStatus
  sourceName: string
  sourceUrl: string
  checkedAt: string
  checkedBy: string
  notes?: string
}

/**
 * Admin verification contract.
 * A place should not become verified until a current, reliable source has been checked.
 */
export function canPublishAsVerified(record: VerificationRecord) {
  return Boolean(
    record.sourceName &&
      record.sourceUrl &&
      record.checkedAt &&
      record.checkedBy &&
      record.status === 'verified'
  )
}

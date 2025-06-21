const allowedViolationTypes = [
  "lost_key",
  "damaged_locker",
  "unauthorized_use",
  "prohibited_items",
  "late_renewal",
  "abandoned_items",
  "other",
] as const

const allowedFineStatuses = [
  "paid",
  "unpaid",
  "partial",
  "waived",
  "under_review",
] as const

export function isViolationType(value: string): value is ViolationType {
  return allowedViolationTypes.includes(value as ViolationType)
}

export function isFineStatus(value: string): value is FineStatus {
  return allowedFineStatuses.includes(value as FineStatus)
}

type FineStatus = (typeof allowedFineStatuses)[number]
type ViolationType = (typeof allowedViolationTypes)[number]

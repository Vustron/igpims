export const userRoles = [
  "admin",
  "user",
  "ssc_president",
  "dpdm_secretary",
  "dpdm_officers",
  "ssc_treasurer",
  "ssc_auditor",
  "chief_legislator",
  "legislative_secretary",
  "ssc_officer",
  "student",
] as const

export type UserRole = (typeof userRoles)[number]

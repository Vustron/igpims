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

export function normalizeViolations(violations: any): string[] {
  if (!violations) return []

  const result = new Set<string>()

  const addToSet = (value: any) => {
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            if (typeof item === "string") result.add(item)
          })
        } else {
          result.add(value)
        }
      } catch {
        result.add(value)
      }
    }
  }

  if (Array.isArray(violations)) {
    violations.forEach((item) => addToSet(item))
  } else if (violations) {
    addToSet(violations)
  }

  return Array.from(result)
}

export function normalizeViolation(
  existingViolations: any,
  newViolations: any,
): string[] {
  const violationSet = new Set<string>()

  if (existingViolations) {
    let existing: string[] = []

    if (typeof existingViolations === "string") {
      try {
        const parsed = JSON.parse(existingViolations)
        existing = Array.isArray(parsed) ? parsed : [existingViolations]
      } catch {
        existing = [existingViolations]
      }
    } else if (Array.isArray(existingViolations)) {
      existing = existingViolations.flatMap((v) => {
        if (typeof v === "string") {
          try {
            const parsed = JSON.parse(v)
            return Array.isArray(parsed) ? parsed : [v]
          } catch {
            return [v]
          }
        }
        return []
      })
    }

    existing.forEach((v) => {
      if (typeof v === "string" && v.trim()) violationSet.add(v.trim())
    })
  }

  if (newViolations) {
    let updated: string[] = []

    if (typeof newViolations === "string") {
      try {
        const parsed = JSON.parse(newViolations)
        updated = Array.isArray(parsed) ? parsed : [newViolations]
      } catch {
        updated = [newViolations]
      }
    } else if (Array.isArray(newViolations)) {
      updated = newViolations.flatMap((v) => {
        if (typeof v === "string") {
          try {
            const parsed = JSON.parse(v)
            return Array.isArray(parsed) ? parsed : [v]
          } catch {
            return [v]
          }
        }
        return []
      })
    }

    updated.forEach((v) => {
      if (typeof v === "string" && v.trim()) violationSet.add(v.trim())
    })
  }

  return Array.from(violationSet)
}

export function parseViolations(violations: any): string[] {
  if (!violations) return []

  if (
    Array.isArray(violations) &&
    violations.every((v) => typeof v === "string" && !v.startsWith("["))
  ) {
    return violations
  }

  if (typeof violations === "string") {
    try {
      const parsed = JSON.parse(violations)
      if (Array.isArray(parsed)) {
        return parsed
      }
      return [violations]
    } catch {
      return [violations]
    }
  }

  if (Array.isArray(violations)) {
    const result: string[] = []

    for (const item of violations) {
      if (typeof item === "string") {
        try {
          const parsed = JSON.parse(item)
          if (Array.isArray(parsed)) {
            result.push(...parsed)
          } else {
            result.push(item)
          }
        } catch {
          result.push(item)
        }
      }
    }

    return [...new Set(result)]
  }

  return []
}

type FineStatus = (typeof allowedFineStatuses)[number]
type ViolationType = (typeof allowedViolationTypes)[number]

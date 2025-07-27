import { User } from "../db/schemas"

export function getAssignedOfficers(
  assignedOfficers: any,
  userMap: Map<string, User>,
): User[] {
  try {
    if (Array.isArray(assignedOfficers)) {
      return assignedOfficers
        .map((id) => userMap.get(id))
        .filter((user): user is User => user !== undefined)
    }

    if (typeof assignedOfficers === "string") {
      const parsed = JSON.parse(assignedOfficers)
      if (Array.isArray(parsed)) {
        return parsed
          .map((id) => userMap.get(id))
          .filter((user): user is User => user !== undefined)
      }
    }

    return []
  } catch (e) {
    console.error("Error parsing assigned officers:", e)
    return []
  }
}

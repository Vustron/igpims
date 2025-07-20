"use client"

import { useCheckRoleStore } from "@/hooks/use-check-role"
import { useEffect } from "react"

export default function UserRoleProvider({
  children,
  initialRole,
}: {
  children: React.ReactNode
  initialRole?: string
}) {
  const { setUserRole } = useCheckRoleStore()

  useEffect(() => {
    if (initialRole) {
      setUserRole(initialRole)
    }
  }, [initialRole, setUserRole])

  return <>{children}</>
}

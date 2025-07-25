"use client"

import { createContext, useContext } from "react"
import { Session } from "@/backend/db/schemas"

const SessionContext = createContext<Session | null>(null)

export const SessionProvider = ({
  children,
  value,
}: React.PropsWithChildren<{ value: Session }>) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  return context
}

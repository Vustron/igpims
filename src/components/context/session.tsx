"use client"

import { createContext } from "react"

import { useContext } from "react"

import type { Session } from "@/schemas/drizzle-schema"

const SessionContext = createContext<Session | null>(null)

const SessionProvider = ({
  children,
  value,
}: React.PropsWithChildren<{ value: Session }>) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export default SessionProvider

export const useSession = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  return context
}

import { DashboardSideBar } from "@/features/layouts/dashboard-sidebar"
import { SessionProvider } from "@/components/context/session"

import { getSession } from "@/config/session"
import { presentor } from "@/utils/presentor"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const data = presentor(session)
  const parsedData = {
    ...data,
    expiresAt: new Date(data.expiresAt),
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  }
  return (
    <SessionProvider value={parsedData}>
      <DashboardSideBar>{children}</DashboardSideBar>
    </SessionProvider>
  )
}

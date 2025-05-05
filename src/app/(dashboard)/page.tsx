import { ContentLayout } from "@/features/layouts/content-layout"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <h1 className="font-bold text-2xl">Dashboard</h1>
    </ContentLayout>
  )
}

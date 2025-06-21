import { Metadata } from "next"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { DashboardClient } from "@/features/dashboard/client"
import { ContentLayout } from "@/features/layouts/content-layout"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const dashboardItems: BreadcrumbItemProps[] = [{ label: "Dashboard" }]
  return (
    <ContentLayout title="Dashboard">
      <DynamicBreadcrumb items={dashboardItems} />
      <DashboardClient />
    </ContentLayout>
  )
}

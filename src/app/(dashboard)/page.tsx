import { preFindTotalProfit } from "@/backend/actions/analytics/find-total-profit"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { getSession } from "@/config/session"
import { DashboardClient } from "@/features/dashboard/client"
import { ContentLayout } from "@/features/layouts/content-layout"
import { QueryHydrator } from "@/utils/query-hydrator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const [preFindProfitData] = await Promise.all([preFindTotalProfit()])
  const dashboardItems: BreadcrumbItemProps[] = [{ label: "Dashboard" }]
  const session = await getSession()
  return (
    <QueryHydrator prefetchFns={[preFindProfitData]}>
      <ContentLayout title={`Hello ${session.userName} 👋`}>
        <DynamicBreadcrumb items={dashboardItems} />
        <DashboardClient />
      </ContentLayout>
    </QueryHydrator>
  )
}

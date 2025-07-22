import { preFindTotalProfit } from "@/backend/actions/analytics/find-total-profit"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { ReportClient } from "@/features/report/client"
import { QueryHydrator } from "@/utils/query-hydrator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Report",
}

export default async function SalesReportPage() {
  const [preFindProfitData] = await Promise.all([preFindTotalProfit()])
  const salesReportItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Report" },
  ]
  return (
    <QueryHydrator prefetchFns={[preFindProfitData]}>
      <ContentLayout title="Report">
        <DynamicBreadcrumb items={salesReportItems} />
        <ReportClient />
      </ContentLayout>
    </QueryHydrator>
  )
}

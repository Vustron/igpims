import { preFetchDuePayments } from "@/backend/actions/analytics/due-payments"
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
  const [preFindProfitData, preFetchDuePaymentsData] = await Promise.all([
    preFindTotalProfit(),
    preFetchDuePayments(),
  ])
  const salesReportItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Report" },
  ]
  return (
    <QueryHydrator prefetchFns={[preFindProfitData, preFetchDuePaymentsData]}>
      <ContentLayout title="Report">
        <DynamicBreadcrumb items={salesReportItems} />
        <ReportClient />
      </ContentLayout>
    </QueryHydrator>
  )
}

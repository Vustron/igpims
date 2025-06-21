import { Metadata } from "next"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { ReportClient } from "@/features/report/client"

export const metadata: Metadata = {
  title: "Report",
}

export default async function SalesReportPage() {
  const salesReportItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Report" },
  ]
  return (
    <ContentLayout title="Report">
      <DynamicBreadcrumb items={salesReportItems} />
      <ReportClient />
    </ContentLayout>
  )
}

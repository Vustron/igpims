import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ReportClient } from "@/features/report/client"
import { ContentLayout } from "@/features/layouts/content-layout"

import type { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import type { Metadata } from "next"

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

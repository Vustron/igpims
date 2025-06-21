import { Metadata } from "next"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { FundRequestClient } from "@/features/fund-request/client"
import { ContentLayout } from "@/features/layouts/content-layout"

export const metadata: Metadata = {
  title: "Fund Request",
}

export default async function FundRequestPage() {
  const fundRequestItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Fund Request", href: "/fund-request" },
  ]
  return (
    <ContentLayout title="Fund Request">
      <DynamicBreadcrumb items={fundRequestItems} />
      <FundRequestClient />
    </ContentLayout>
  )
}

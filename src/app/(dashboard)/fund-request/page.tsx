import { preFindManyFundRequests } from "@/backend/actions/fund-request/find-many"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { FundRequestClient } from "@/features/fund-request/client"
import { ContentLayout } from "@/features/layouts/content-layout"
import { QueryHydrator } from "@/utils/query-hydrator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fund Request",
}

export default async function FundRequestPage() {
  const [fundRequestResults] = await Promise.all([preFindManyFundRequests()])
  const fundRequestItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Fund Request", href: "/fund-request" },
  ]
  return (
    <QueryHydrator prefetchFns={[fundRequestResults]}>
      <ContentLayout title="Fund Request">
        <DynamicBreadcrumb items={fundRequestItems} />
        <FundRequestClient />
      </ContentLayout>
    </QueryHydrator>
  )
}

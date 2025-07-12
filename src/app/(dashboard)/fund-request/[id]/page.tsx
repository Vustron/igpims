import { preFindFundRequestById } from "@/backend/actions/fund-request/find-by-id"
import {
  BreadcrumbItemProps,
  DynamicBreadcrumb,
} from "@/components/ui/breadcrumbs"
import { ExpenseTransactionClient } from "@/features/expense-transaction/client"
import { ContentLayout } from "@/features/layouts/content-layout"
import { QueryHydrator } from "@/utils/query-hydrator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Validate Fund Request",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ValidateFundRequestPage({ params }: PageProps) {
  const [resolvedParams, preFindFundRequest] = await Promise.all([
    params,
    preFindFundRequestById((await params).id),
  ])
  const { id } = resolvedParams
  const validateFundRequestItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Fund Request", href: "/fund-request" },
    { label: `${id}` },
  ]
  return (
    <QueryHydrator prefetchFns={[preFindFundRequest]}>
      <ContentLayout title="Validate Fund Request">
        <DynamicBreadcrumb items={validateFundRequestItems} />
        <ExpenseTransactionClient />
      </ContentLayout>
    </QueryHydrator>
  )
}

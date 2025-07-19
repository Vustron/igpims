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
  title: "Fund Request",
}

interface PageProps {
  params: { id: string }
  searchParams: {
    isOnSubmitReceipts?: string
    isValidateExpenses?: string
  }
}

function getPageTitle(searchParams: PageProps["searchParams"]) {
  if (searchParams.isOnSubmitReceipts === "true") {
    return "Confirm Receipts"
  }
  if (searchParams.isValidateExpenses === "true") {
    return "Validate Expenses"
  }
  return "Fund Request Details"
}

export default async function ValidateFundRequestPage({
  params,
  searchParams,
}: PageProps) {
  const preFindFundRequest = await preFindFundRequestById(params.id)

  const validateFundRequestItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Fund Request", href: "/fund-request" },
    { label: `${params.id}` },
  ]

  const title = getPageTitle(searchParams)

  return (
    <QueryHydrator prefetchFns={[preFindFundRequest]}>
      <ContentLayout title={title}>
        <DynamicBreadcrumb items={validateFundRequestItems} />
        <ExpenseTransactionClient id={params.id} />
      </ContentLayout>
    </QueryHydrator>
  )
}

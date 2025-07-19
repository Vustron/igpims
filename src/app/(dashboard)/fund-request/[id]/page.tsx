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
  params: Promise<{ id: string }>
  searchParams: Promise<{
    isOnSubmitReceipts?: string
    isValidateExpenses?: string
  }>
}

function getPageTitle(searchParams: {
  isOnSubmitReceipts?: string
  isValidateExpenses?: string
}) {
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
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  const preFindFundRequest = await preFindFundRequestById(resolvedParams.id)

  const validateFundRequestItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Fund Request", href: "/fund-request" },
    { label: `${resolvedParams.id}` },
  ]

  const title = getPageTitle(resolvedSearchParams)

  return (
    <QueryHydrator prefetchFns={[preFindFundRequest]}>
      <ContentLayout title={title}>
        <DynamicBreadcrumb items={validateFundRequestItems} />
        <ExpenseTransactionClient id={resolvedParams.id} />
      </ContentLayout>
    </QueryHydrator>
  )
}

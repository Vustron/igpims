import { FundRequestClient } from "@/features/fund-request/client"
import { ContentLayout } from "@/features/layouts/content-layout"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fund Request",
}

export default async function FundRequestPage() {
  return (
    <ContentLayout title="Fund Request">
      <FundRequestClient />
    </ContentLayout>
  )
}

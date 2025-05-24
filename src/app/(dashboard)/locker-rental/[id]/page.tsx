import { preFindRentByLockerId } from "@/backend/actions/locker-rental/find-rent-by-locker-id"
import { preFindLockerById } from "@/backend/actions/locker/find-by-id"
import { ContentLayout } from "@/features/layouts/content-layout"
import { LockerClient } from "@/features/locker/client"
import { QueryHydrator } from "@/utils/query-hydrator"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Locker",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LockerIdPage({ params }: PageProps) {
  const [resolvedParams, preFindLocker, preFindLockerRent] = await Promise.all([
    params,
    preFindLockerById((await params).id),
    preFindRentByLockerId((await params).id),
  ])
  const { id } = resolvedParams
  return (
    <ContentLayout title="Locker">
      <QueryHydrator prefetchFns={[preFindLocker, preFindLockerRent]}>
        <LockerClient id={id} />
      </QueryHydrator>
    </ContentLayout>
  )
}

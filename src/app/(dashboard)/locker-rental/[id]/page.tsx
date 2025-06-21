import { Metadata } from "next"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { LockerClient } from "@/features/locker-igp/locker/client"
import { preFindLockerById } from "@/backend/actions/locker/find-by-id"
import { QueryHydrator } from "@/utils/query-hydrator"

export const metadata: Metadata = {
  title: "Locker",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LockerIdPage({ params }: PageProps) {
  const [resolvedParams, preFindLocker] = await Promise.all([
    params,
    preFindLockerById((await params).id),
  ])
  const { id } = resolvedParams
  const lockerItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Locker Rental", href: "/locker-rental" },
    { label: "Locker" },
  ]
  return (
    <ContentLayout title="Locker">
      <DynamicBreadcrumb items={lockerItems} />
      <QueryHydrator prefetchFns={[preFindLocker]}>
        <LockerClient id={id} />
      </QueryHydrator>
    </ContentLayout>
  )
}

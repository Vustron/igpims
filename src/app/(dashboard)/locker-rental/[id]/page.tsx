import { preFindLockerById } from "@/backend/actions/locker/find-by-id"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { LockerClient } from "@/features/locker-igp/locker/client"
import { QueryHydrator } from "@/utils/query-hydrator"
import { Metadata } from "next"

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
    <QueryHydrator prefetchFns={[preFindLocker]}>
      <ContentLayout title="Locker">
        <DynamicBreadcrumb items={lockerItems} />
        <LockerClient id={id} />
      </ContentLayout>
    </QueryHydrator>
  )
}

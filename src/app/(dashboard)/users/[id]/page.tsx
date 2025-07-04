import { Metadata } from "next"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { UserClient } from "@/features/user/client"
import { preFindUserById } from "@/backend/actions/user/find-by-id"
import { QueryHydrator } from "@/utils/query-hydrator"

export const metadata: Metadata = {
  title: "User",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function UserPage({ params }: PageProps) {
  const [resolvedParams, preFindUser] = await Promise.all([
    params,
    preFindUserById((await params).id),
  ])
  const { id } = resolvedParams
  const userItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Users", href: "/users" },
    { label: "User" },
  ]
  return (
    <QueryHydrator prefetchFns={[preFindUser]}>
      <ContentLayout title="User">
        <DynamicBreadcrumb items={userItems} />
        <UserClient id={id} />
      </ContentLayout>
    </QueryHydrator>
  )
}

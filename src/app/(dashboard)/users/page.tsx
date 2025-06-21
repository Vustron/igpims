import { Metadata } from "next"
import { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { UsersClient } from "@/features/users/client"
import { preFindManyUser } from "@/backend/actions/user/find-many"
import { QueryHydrator } from "@/utils/query-hydrator"

export const metadata: Metadata = {
  title: "Users",
}

export default async function UsersPage() {
  const [preFindmanyUsers] = await Promise.all([preFindManyUser()])
  const usersItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Users" },
  ]
  return (
    <QueryHydrator prefetchFns={[preFindmanyUsers]}>
      <ContentLayout title="Users">
        <DynamicBreadcrumb items={usersItems} />
        <UsersClient />
      </ContentLayout>
    </QueryHydrator>
  )
}

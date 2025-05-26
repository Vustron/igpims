import { DynamicBreadcrumb } from "@/components/ui/breadcrumbs/dynamic-breadcrumb"
import { ContentLayout } from "@/features/layouts/content-layout"
import { QueryHydrator } from "@/utils/query-hydrator"
import { UserClient } from "@/features/user/client"

import { preFindUserById } from "@/backend/actions/user/find-by-id"
import { presentor } from "@/utils/presentor"
import { getSession } from "@/config/session"

import type { BreadcrumbItemProps } from "@/components/ui/breadcrumbs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "User",
}

export default async function CurrentUserPage() {
  const [session, preFindUser] = await Promise.all([
    getSession(),
    preFindUserById((await getSession()).userId!),
  ])
  const userData = presentor(session)
  const userItems: BreadcrumbItemProps[] = [
    { label: "Dashboard", href: "/" },
    { label: "Users", href: "/users" },
    { label: "Current User" },
  ]
  return (
    <QueryHydrator prefetchFns={[preFindUser]}>
      <ContentLayout title="Edit Profile">
        <DynamicBreadcrumb items={userItems} />
        <UserClient id={userData.userId} />
      </ContentLayout>
    </QueryHydrator>
  )
}

import QueryHydrator from "@/utils/query-hydrator"
import UserClient from "@/features/user/client"

import { preFindUserById } from "@/backend/actions/user/find-by-id"
import { presentor } from "@/utils/presentor"
import { getSession } from "@/config/session"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "User",
}

export default async function UserPage() {
  const [session, preFindUser] = await Promise.all([
    getSession(),
    preFindUserById((await getSession()).userId!),
  ])
  const userData = presentor(session)
  return (
    <QueryHydrator prefetchFns={[preFindUser]}>
      <UserClient id={userData.userId} />
    </QueryHydrator>
  )
}

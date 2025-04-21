import QueryHydrator from "@/utils/query-hydrator"
import Main from "@/features/main"

import { preFindUserById } from "@/backend/actions/user/find-by-id"
import { presentor } from "@/utils/presentor"
import { getSession } from "@/config/session"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home",
}

export default async function RootPage() {
  const [session, preFindAccount] = await Promise.all([
    getSession(),
    preFindUserById((await getSession()).userId!),
  ])
  const userData = presentor(session)
  return (
    <QueryHydrator prefetchFns={[preFindAccount]}>
      <Main id={userData.userId} session={userData} />
    </QueryHydrator>
  )
}

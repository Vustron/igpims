import SignInClient from "@/features/auth/sign-in/client"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In",
}

interface PageProps {
  searchParams: Promise<{ userId: string }>
}

export default async function SignInPage({ searchParams }: PageProps) {
  const [resolvedParams] = await Promise.all([searchParams])
  const { userId } = resolvedParams
  return (
    <div className="relative grid h-screen w-full grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block">
        <div className="size-full" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <SignInClient userId={userId} />
      </div>
    </div>
  )
}

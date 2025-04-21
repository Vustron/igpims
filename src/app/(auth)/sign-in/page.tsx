import SignInClient from "@/features/sign-in/client"

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
    <div className="m-auto flex size-full flex-col items-center justify-center space-y-12">
      <SignInClient userId={userId} />
    </div>
  )
}

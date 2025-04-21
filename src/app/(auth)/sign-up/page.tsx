import SignUpClient from "@/features/sign-up/client"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up",
}

export default async function SignUpPage() {
  return (
    <div className="m-auto flex size-full flex-col items-center justify-center space-y-12">
      <SignUpClient />
    </div>
  )
}

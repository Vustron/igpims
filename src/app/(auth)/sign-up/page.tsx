import SignUpClient from "@/features/auth/sign-up/client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up",
}

export default async function SignUpPage() {
  return (
    <div className="relative grid h-screen w-full grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block">
        <div className="size-full" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <SignUpClient />
      </div>
    </div>
  )
}

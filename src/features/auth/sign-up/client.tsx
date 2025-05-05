"use client"

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  // CardDescription,
} from "@/components/ui/cards"
import { DynamicButton } from "@/components/ui/buttons"
import SignUpForm from "@/features/auth/sign-up/sign-up-form"

import Link from "next/link"
import Image from "next/image"

const SignUpClient = () => {
  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Card className="w-full border-[2px] border-amber-300 bg-[#2B291A] sm:w-96">
        <CardHeader>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="DNSC Supreme Student Council Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          <CardTitle className="text-center text-lg text-white">
            Please sign-up to continue
          </CardTitle>
          {/* <CardDescription className="text-center">
            Welcome! Please signup to continue
          </CardDescription> */}
        </CardHeader>

        <CardContent>
          <SignUpForm />
        </CardContent>

        <CardFooter>
          <div className="grid w-full gap-y-4">
            <DynamicButton variant="link" size="sm" asChild>
              <Link href="/sign-in">
                <span className="text-muted-foreground text-sm">
                  Already have an account? Sign in
                </span>
              </Link>
            </DynamicButton>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUpClient

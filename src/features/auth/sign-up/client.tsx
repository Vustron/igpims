"use client"

import Image from "next/image"
import Link from "next/link"
import { DynamicButton } from "@/components/ui/buttons"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards"
import SignUpForm from "./sign-up-form"

const SignUpClient = () => {
  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Card className="w-full border-2 border-[#4A4520] bg-background shadow-xl sm:w-96">
        <CardHeader>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="DNSC Supreme Student Council Logo"
              width={100}
              height={100}
              className="rounded-full"
              priority
            />
          </div>
          <CardTitle className="text-center text-lg">
            Please sign-up to continue
          </CardTitle>
          {/* <CardDescription className="text-center">
            Welcome! Please signup to continue
          </CardDescription> */}
        </CardHeader>

        <CardContent>
          <SignUpForm isOnAdmin />
        </CardContent>

        <CardFooter>
          <div className="grid w-full gap-y-4">
            <DynamicButton variant="link" size="sm" asChild>
              <Link href="/sign-in">
                <span className="text-sm hover:text-amber-300">
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

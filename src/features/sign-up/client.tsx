"use client"

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from "@/components/ui/cards"
import { DynamicButton } from "@/components/ui/buttons"
import SignUpForm from "@/features/sign-up/form"

import Link from "next/link"

const SignUpClient = () => {
  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Welcome! Please signup to continue</CardDescription>
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

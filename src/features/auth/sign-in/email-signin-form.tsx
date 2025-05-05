"use client"

import { DynamicForm } from "@/components/ui/forms"

import { zodResolver } from "@hookform/resolvers/zod"
import { catchError } from "@/utils/catch-error"
import { signInSchema } from "@/schemas/user"
import toast from "react-hot-toast"

import { useSignInUser } from "@/backend/actions/user/sign-in"
import { useForm } from "react-hook-form"

import type { FieldConfig } from "@/interfaces/form"
import type { SignInPayload } from "@/schemas/user"

export const SignInEmailForm = () => {
  const signIn = useSignInUser()

  const signInFields: FieldConfig<SignInPayload>[] = [
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Your email address",
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "Your password",
    },
  ]

  const form = useForm<SignInPayload>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const submitHandler = async (values: SignInPayload) => {
    await toast.promise(signIn.mutateAsync(values), {
      loading: <span className="animate-pulse">Signing in...</span>,
      success: "User signed in successfully",
      error: (error: unknown) => catchError(error),
    })
    form.reset()
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={submitHandler}
      fields={signInFields}
      submitButtonTitle="Sign In"
      submitButtonClassname="w-full bg-amber-300 text-black hover:bg-amber-400 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#222216] disabled:cursor-not-allowed disabled:opacity-50"
      mutation={signIn}
      isSignIn
      isFloatingLabelInput={false}
    />
  )
}

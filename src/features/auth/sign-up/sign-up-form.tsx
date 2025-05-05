"use client"

import { DynamicForm } from "@/components/ui/forms"

import { zodResolver } from "@hookform/resolvers/zod"
import { catchError } from "@/utils/catch-error"
import { signUpSchema } from "@/schemas/user"
import toast from "react-hot-toast"

import { useSignUpUser } from "@/backend/actions/user/sign-up"
import { useForm } from "react-hook-form"

import type { FieldConfig } from "@/interfaces/form"
import type { SignUpPayload } from "@/schemas/user"

const SignUpForm = () => {
  const signUp = useSignUpUser()

  const signInFields: FieldConfig<SignUpPayload>[] = [
    {
      name: "name",
      type: "text",
      label: "Name",
      placeholder: "",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Your email",
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "Your password",
    },
  ]

  const form = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const submitHandler = async (values: SignUpPayload) => {
    await toast.promise(signUp.mutateAsync(values), {
      loading: <span className="animate-pulse">Creating user...</span>,
      success: "Successfully created user",
      error: (error: unknown) => catchError(error),
    })
    form.reset()
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={submitHandler}
      fields={signInFields}
      submitButtonTitle="Sign Up"
      mutation={signUp}
      isSignUp
      submitButtonClassname="w-full bg-amber-300 text-black hover:bg-amber-400 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#222216] disabled:cursor-not-allowed disabled:opacity-50"
    />
  )
}

export default SignUpForm

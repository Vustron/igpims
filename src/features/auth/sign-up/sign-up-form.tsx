"use client"

import { DynamicForm } from "@/components/ui/forms"

import { zodResolver } from "@hookform/resolvers/zod"
import { catchError } from "@/utils/catch-error"
import { signUpSchema } from "@/validation/user"
import toast from "react-hot-toast"

import { useSignUpUser } from "@/backend/actions/user/sign-up"
import { useForm } from "react-hook-form"

import type { FieldConfig } from "@/interfaces/form"
import type { SignUpPayload } from "@/validation/user"
import { cn } from "@/utils/cn"

interface SignUpFormProps {
  isOnAdmin?: boolean
  onSuccess?: () => void
  onError?: () => void
}

const SignUpForm = ({ isOnAdmin, onSuccess, onError }: SignUpFormProps) => {
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
      name: "role",
      label: "Role",
      type: "select",
      placeholder: "Select user role",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "SSC President", value: "ssc_president" },
        { label: "DPDM Secretary", value: "dpdm_secretary" },
        { label: "DPDM Officers", value: "dpdm_officers" },
        { label: "SSC Treasurer", value: "ssc_treasurer" },
        { label: "SSC Auditor", value: "ssc_auditor" },
        { label: "Chief Legislator", value: "chief_legislator" },
        { label: "SSC Secretary", value: "ssc_secretary" },
        { label: "Student", value: "student" },
      ],
      description: "Select the user's role and permissions",
      required: true,
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
      role: "user",
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

    if (signUp.isSuccess) {
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={submitHandler}
      fields={signInFields}
      submitButtonTitle="Sign Up"
      mutation={signUp}
      isSignUp
      submitButtonClassname={cn(
        isOnAdmin
          ? "w-full bg-amber-300 text-black hover:bg-amber-400 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#222216] disabled:cursor-not-allowed disabled:opacity-50"
          : "",
      )}
    />
  )
}

export default SignUpForm

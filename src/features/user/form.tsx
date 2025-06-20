import { DynamicForm } from "@/components/ui/forms"

import { useUpdateUserInfo } from "@/backend/actions/user/update-info"
import { useForm } from "react-hook-form"

import { convertImageToBase64 } from "@/utils/image-convert-base64"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserSchema } from "@/validation/user"
import { catchError } from "@/utils/catch-error"
import toast from "react-hot-toast"

import type { UpdateUserPayload } from "@/validation/user"
import type { FieldConfig } from "@/interfaces/form"

interface EditUserFormProps {
  data: UpdateUserPayload
  id: string
}

export const EditUserForm = ({ data, id }: EditUserFormProps) => {
  const updateInfo = useUpdateUserInfo(id)

  const form = useForm<UpdateUserPayload>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: data.name,
      email: data.email,
      image: data.image ? data.image : null,
      emailVerified: data.emailVerified ? data.emailVerified : false,
      role: data.role || "user",
      currentPassword: "",
      newPassword: "",
      otpSignIn: data.otpSignIn ? data.otpSignIn : false,
    },
  })

  const editUserFields: FieldConfig<UpdateUserPayload>[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter your name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      name: "image",
      label: "Image",
      type: "image",
      placeholder: "Select your image",
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
      name: "emailVerified",
      label: "Verification",
      type: "switch",
      placeholder: "Select your verification status",
      description: "Enable this if the account is verified",
    },
    {
      name: "currentPassword",
      label: "Current Password",
      type: "password",
      placeholder: "Enter your current password",
    },
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      placeholder: "Enter your new password",
    },
  ]

  const onSubmit = async (values: UpdateUserPayload) => {
    try {
      const formData = { ...values }

      if (formData.image instanceof File) {
        const base64Image = await convertImageToBase64(formData.image)
        formData.image = base64Image
      }

      await toast.promise(updateInfo.mutateAsync(formData), {
        loading: <span className="animate-pulse">Updating user...</span>,
        success: "User updated",
        error: (error: unknown) => catchError(error),
      })

      form.reset()
    } catch (error) {
      toast.error("Error processing image")
    }
  }

  return (
    <DynamicForm
      form={form}
      fields={editUserFields}
      onSubmit={onSubmit}
      submitButtonTitle="Save changes"
      className="w-auto"
      mutation={updateInfo}
      isOnEditAccount
    />
  )
}

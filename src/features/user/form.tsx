import { DynamicForm } from "@/components/ui/forms"

import { useUpdateUserInfo } from "@/backend/actions/user/update-info"
import { useForm } from "react-hook-form"

import { convertImageToBase64 } from "@/utils/image-convert-base64"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserSchema } from "@/schemas/user"
import { catchError } from "@/utils/catch-error"
import toast from "react-hot-toast"

import type { UpdateUserPayload } from "@/schemas/user"
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

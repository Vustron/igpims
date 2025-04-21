import { api } from "@/backend/helpers/api-client"
import { updateUserSchema } from "@/schemas/user"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { UpdateUserPayload } from "@/schemas/user"
import type { User } from "@/schemas/drizzle-schema"

export async function updateUserInfo(payload: UpdateUserPayload, id: string) {
  return api.patch<UpdateUserPayload, User>("auth/update-info", payload, {
    params: { id },
  })
}

export const useUpdateUserInfo = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [`update-user-${id}-${new Date()}`],
    mutationFn: async (payload: UpdateUserPayload) => {
      const sanitizedData = sanitizer<UpdateUserPayload>(
        payload,
        updateUserSchema,
      )
      return await updateUserInfo(sanitizedData, id)
    },
    onSuccess: async (updatedUser) => {
      await queryClient.invalidateQueries({
        queryKey: ["user", id],
      })
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      })
      queryClient.setQueryData(["user", id], (old: User) => ({
        ...old,
        ...updatedUser,
      }))
      queryClient.setQueryData<User[]>(["users"], (oldData) => {
        if (!oldData) return [updatedUser]
        return oldData.map((user) =>
          user.id === id ? { ...user, ...updatedUser } : user,
        )
      })
      router.replace("/")
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => catchError(error),
  })
}

import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { User } from "@/schemas/drizzle-schema"

export async function deleteUserById(id: string) {
  return api.delete("auth/delete-user-by-id", {
    params: { id },
  })
}

export const useDeleteUserById = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [`delete-user-by-id-${id}-${new Date()}`],
    mutationFn: async () => {
      return await deleteUserById(id)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      })
      queryClient.setQueryData<User[]>(["users"], (oldData) => {
        if (!oldData) return []
        return oldData.filter((user) => !id.includes(user.id))
      })
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => catchError(error),
  })
}

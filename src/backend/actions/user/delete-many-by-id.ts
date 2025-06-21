import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { User } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  DeleteManyUserByIdPayload,
  deleteManyUserByIdSchema,
} from "@/validation/user"

export async function deleteManyUserById(payload: DeleteManyUserByIdPayload) {
  return api.post<DeleteManyUserByIdPayload, { deletedIds: string[] }>(
    "auth/delete-many-user-by-id",
    payload,
  )
}

export const useDeleteManyUserById = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [`delete-many-user-by-id-${new Date()}`],
    mutationFn: async (payload: DeleteManyUserByIdPayload) => {
      const sanitizedData = sanitizer<DeleteManyUserByIdPayload>(
        payload,
        deleteManyUserByIdSchema,
      )
      return await deleteManyUserById(sanitizedData)
    },
    onSuccess: async (response) => {
      const queryFilter: QueryFilters = {
        queryKey: ["users"],
      }
      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<User[]>(["users"], (oldData) => {
        if (!oldData) return []
        return oldData.filter((user) => !response.deletedIds.includes(user.id))
      })
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => catchError(error),
  })
}

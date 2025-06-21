import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { Violation } from "@/validation/violation"
import { PaginatedViolationsResponse } from "./find-many"

export async function deleteViolation(id: string) {
  return api.delete("violations/delete-violation", {
    params: { id },
  })
}

export const useDeleteViolation = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-violation", id],
    mutationFn: async () => {
      return await deleteViolation(id)
    },
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["violations"] }),
        queryClient.cancelQueries({ queryKey: ["violation", id] }),
      ])
      const previousViolation = queryClient.getQueryData<Violation>([
        "violation",
        id,
      ])
      const previousViolations = queryClient.getQueryData(["violations"])

      queryClient.setQueriesData<PaginatedViolationsResponse>(
        { queryKey: ["violations"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.filter((violation) => violation.id !== id),
            meta: {
              ...oldData.meta,
              totalItems: Math.max(0, oldData.meta.totalItems - 1),
              totalPages: Math.max(
                1,
                Math.ceil(
                  (oldData.meta.totalItems - 1) / oldData.meta.itemsPerPage,
                ),
              ),
            },
          }
        },
      )

      return { previousViolation, previousViolations }
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["violation", id] })
    },
    onError: (error, _variables, context) => {
      if (context?.previousViolations) {
        queryClient.setQueryData(["violations"], context.previousViolations)
      }
      if (context?.previousViolation) {
        queryClient.setQueryData(["violation", id], context.previousViolation)
      }
      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}

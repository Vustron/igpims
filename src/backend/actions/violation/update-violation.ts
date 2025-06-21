import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import { Violation, ViolationSchema } from "@/validation/violation"
import { PaginatedViolationsResponse } from "./find-many"

export async function updateViolation(
  id: string,
  payload: Partial<Violation>,
): Promise<Violation> {
  return api.patch<Partial<Violation>, Violation>(
    "violations/update-violation",
    payload,
    {
      params: { id },
    },
  )
}

export const useUpdateViolation = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-violation", id],
    mutationFn: async (payload: Partial<Violation>) => {
      const sanitizedData = sanitizer<Partial<Violation>>(
        payload,
        ViolationSchema.partial(),
      )
      return await updateViolation(id, sanitizedData)
    },
    onMutate: async (updatedData) => {
      await queryClient.cancelQueries({ queryKey: ["violations"] })
      await queryClient.cancelQueries({ queryKey: ["violation", id] })

      const previousViolation = queryClient.getQueryData<Violation>([
        "violation",
        id,
      ])
      const previousViolations = queryClient.getQueryData(["violations"])

      if (previousViolation) {
        queryClient.setQueryData(["violation", id], {
          ...previousViolation,
          ...updatedData,
          updatedAt: new Date(),
        })
      }

      return { previousViolation, previousViolations }
    },
    onSuccess: (updatedViolation: Violation) => {
      queryClient.setQueryData(["violation", id], updatedViolation)

      queryClient.setQueriesData<PaginatedViolationsResponse>(
        { queryKey: ["violations"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.map((violation) =>
              violation.id === id ? updatedViolation : violation,
            ),
          }
        },
      )
    },
    onError: (error, _variables, context) => {
      if (context?.previousViolation) {
        queryClient.setQueryData(["violation", id], context.previousViolation)
      }
      if (context?.previousViolations) {
        queryClient.setQueryData(["violations"], context.previousViolations)
      }
      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}

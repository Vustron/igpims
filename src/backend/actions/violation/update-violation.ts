import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { normalizeViolations } from "@/backend/helpers/violation-helpers"
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
      const normalizedViolations = normalizeViolations(payload.violations)

      const sanitizedData = sanitizer<Partial<Violation>>(
        {
          ...payload,
          violations: normalizedViolations,
        },
        ViolationSchema.partial(),
      )
      return await updateViolation(id, sanitizedData)
    },
    onMutate: async (updatedData) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["violations"] }),
        queryClient.cancelQueries({ queryKey: ["violation", id] }),
      ])

      const previousViolation = queryClient.getQueryData<Violation>([
        "violation",
        id,
      ])
      const previousViolations = queryClient.getQueryData(["violations"])

      const normalizedViolations = normalizeViolations(updatedData.violations)

      if (previousViolation) {
        queryClient.setQueryData(["violation", id], {
          ...previousViolation,
          ...updatedData,
          violations: normalizedViolations,
        })
      }

      return { previousViolation, previousViolations }
    },
    onSuccess: (updatedViolation: Violation) => {
      const normalizedViolation = {
        ...updatedViolation,
        violations: normalizeViolations(updatedViolation.violations),
      }

      queryClient.setQueryData(["violation", id], normalizedViolation)

      queryClient.setQueriesData<PaginatedViolationsResponse>(
        { queryKey: ["violations"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.map((violation) =>
              violation.id === id ? normalizedViolation : violation,
            ),
          }
        },
      )

      const infiniteQueries = queryClient.getQueriesData({
        queryKey: ["violations-infinite"],
      })

      infiniteQueries.forEach(([queryKey, oldData]: [any, any]) => {
        if (oldData?.pages) {
          const newPages = oldData.pages.map((page: any) => {
            if (!page?.data) return page

            const updatedData = page.data.map((violation: Violation) =>
              violation.id === id ? normalizedViolation : violation,
            )

            return {
              ...page,
              data: updatedData,
            }
          })

          queryClient.setQueryData(queryKey, {
            ...oldData,
            pages: newPages,
          })
        }
      })
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

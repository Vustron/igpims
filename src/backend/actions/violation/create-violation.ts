import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import { Violation, ViolationSchema } from "@/validation/violation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { PaginatedViolationsResponse, ViolationFilters } from "./find-many"

export async function createViolation(
  payload: Omit<Violation, "id">,
): Promise<Violation> {
  return api.post<Omit<Violation, "id">, Violation>(
    "violations/create-violation",
    payload,
  )
}

export const useCreateViolation = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-violation"],
    mutationFn: async (payload: Omit<Violation, "id">) => {
      const violationsArray = Array.isArray(payload.violations)
        ? payload.violations
        : typeof payload.violations === "string"
          ? payload.violations
              .split(",")
              .map((v) => v.trim())
              .filter((v) => v)
          : []

      const sanitizedData = sanitizer<Omit<Violation, "id">>(
        {
          ...payload,
          violations: violationsArray,
        },
        ViolationSchema.omit({ id: true }),
      )
      return await createViolation(sanitizedData)
    },
    onMutate: async (newViolation) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["violations"] }),
        queryClient.cancelQueries({ queryKey: ["violations-infinite"] }),
      ])

      const previousQueriesData = new Map()

      queryClient
        .getQueriesData({ queryKey: ["violations"] })
        .forEach(([queryKey, data]) => {
          if (data) {
            previousQueriesData.set(JSON.stringify(queryKey), data)
          }
        })

      queryClient
        .getQueriesData({ queryKey: ["violations-infinite"] })
        .forEach(([queryKey, data]) => {
          if (data) {
            previousQueriesData.set(JSON.stringify(queryKey), data)
          }
        })

      const violationsArray = Array.isArray(newViolation.violations)
        ? newViolation.violations
        : typeof newViolation.violations === "string"
          ? newViolation.violations
              .split(",")
              .map((v) => v.trim())
              .filter((v) => v)
          : []

      const optimisticViolation: Violation = {
        ...newViolation,
        violations: violationsArray,
        id: `temp-${Date.now()}`,
      }

      const allViolationQueries =
        queryClient.getQueriesData<PaginatedViolationsResponse>({
          queryKey: ["violations"],
        })

      allViolationQueries.forEach(([queryKey, oldData]) => {
        if (oldData?.data) {
          const queryFilters = (queryKey as any)[1] as ViolationFilters

          if (queryFilters.page === 1 || !queryFilters.page) {
            const updatedData = [optimisticViolation, ...oldData.data]
            const newTotalItems = oldData.meta.totalItems + 1

            queryClient.setQueryData(queryKey, {
              ...oldData,
              data: updatedData,
              meta: {
                ...oldData.meta,
                totalItems: newTotalItems,
                totalPages: Math.ceil(
                  newTotalItems / oldData.meta.itemsPerPage,
                ),
                hasNextPage:
                  (queryFilters.page || 1) <
                  Math.ceil(newTotalItems / oldData.meta.itemsPerPage),
              },
            })
          } else {
            const newTotalItems = oldData.meta.totalItems + 1
            queryClient.setQueryData(queryKey, {
              ...oldData,
              meta: {
                ...oldData.meta,
                totalItems: newTotalItems,
                totalPages: Math.ceil(
                  newTotalItems / oldData.meta.itemsPerPage,
                ),
                hasNextPage:
                  (queryFilters.page || 1) <
                  Math.ceil(newTotalItems / oldData.meta.itemsPerPage),
              },
            })
          }
        }
      })

      const allInfiniteQueries = queryClient.getQueriesData({
        queryKey: ["violations-infinite"],
      })

      allInfiniteQueries.forEach(([queryKey, oldData]: [any, any]) => {
        if (oldData?.pages && oldData.pages.length > 0) {
          const newPages = [...oldData.pages]
          const firstPage = newPages[0]

          if (firstPage?.data) {
            const newTotalItems = firstPage.meta.totalItems + 1
            newPages[0] = {
              ...firstPage,
              data: [optimisticViolation, ...firstPage.data],
              meta: {
                ...firstPage.meta,
                totalItems: newTotalItems,
                totalPages: Math.ceil(
                  newTotalItems / firstPage.meta.itemsPerPage,
                ),
                hasNextPage:
                  firstPage.meta.currentPage <
                  Math.ceil(newTotalItems / firstPage.meta.itemsPerPage),
              },
            }

            queryClient.setQueryData(queryKey, {
              ...oldData,
              pages: newPages,
            })
          }
        }
      })

      return {
        previousQueriesData,
        optimisticViolation,
      }
    },
    onSuccess: (newViolation: Violation, _variables, context) => {
      const normalizedViolation = {
        ...newViolation,
        violations: Array.isArray(newViolation.violations)
          ? newViolation.violations
          : typeof newViolation.violations === "string"
            ? newViolation.violations
                .split(",")
                .map((v) => v.trim())
                .filter((v) => v)
            : [],
      }

      queryClient.setQueryData(
        ["violation", normalizedViolation.id],
        normalizedViolation,
      )

      const allViolationQueries =
        queryClient.getQueriesData<PaginatedViolationsResponse>({
          queryKey: ["violations"],
        })

      allViolationQueries.forEach(([queryKey, oldData]) => {
        if (oldData?.data) {
          const updatedData = oldData.data.map((violation) =>
            violation.id === context?.optimisticViolation?.id
              ? normalizedViolation
              : violation,
          )

          queryClient.setQueryData(queryKey, {
            ...oldData,
            data: updatedData,
          })
        }
      })

      const allInfiniteQueries = queryClient.getQueriesData({
        queryKey: ["violations-infinite"],
      })

      allInfiniteQueries.forEach(([queryKey, oldData]: [any, any]) => {
        if (oldData?.pages) {
          const newPages = oldData.pages.map((page: any) => {
            if (!page?.data) return page

            const updatedData = page.data.map((violation: Violation) =>
              violation.id === context?.optimisticViolation?.id
                ? normalizedViolation
                : violation,
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
    onError: (_error, _variables, context) => {
      if (context?.previousQueriesData) {
        context.previousQueriesData.forEach((data, queryKeyString) => {
          const queryKey = JSON.parse(queryKeyString)
          queryClient.setQueryData(queryKey, data)
        })
      }

      catchError(_error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] })
      router.refresh()
    },
  })
}

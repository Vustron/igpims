import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import { Violation, ViolationSchema } from "@/validation/violation"
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
      const sanitizedData = sanitizer<Omit<Violation, "id">>(
        payload,
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

      // Store all existing queries data
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

      const optimisticViolation: Violation = {
        ...newViolation,
        id: `temp-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      // Update each specific query manually
      const allViolationQueries =
        queryClient.getQueriesData<PaginatedViolationsResponse>({
          queryKey: ["violations"],
        })

      allViolationQueries.forEach(([queryKey, oldData]) => {
        if (oldData?.data) {
          const queryFilters = (queryKey as any)[1] as ViolationFilters

          // Only add to first page queries
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
            // For other pages, just update meta
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

      // Update infinite queries
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
      // Set individual violation cache
      queryClient.setQueryData(["violation", newViolation.id], newViolation)

      // Replace optimistic data with real data for paginated queries
      const allViolationQueries =
        queryClient.getQueriesData<PaginatedViolationsResponse>({
          queryKey: ["violations"],
        })

      allViolationQueries.forEach(([queryKey, oldData]) => {
        if (oldData?.data) {
          const updatedData = oldData.data.map((violation) =>
            violation.id === context?.optimisticViolation?.id
              ? newViolation
              : violation,
          )

          queryClient.setQueryData(queryKey, {
            ...oldData,
            data: updatedData,
          })
        }
      })

      // Replace optimistic data with real data for infinite queries
      const allInfiniteQueries = queryClient.getQueriesData({
        queryKey: ["violations-infinite"],
      })

      allInfiniteQueries.forEach(([queryKey, oldData]: [any, any]) => {
        if (oldData?.pages) {
          const newPages = oldData.pages.map((page: any) => {
            if (!page?.data) return page

            const updatedData = page.data.map((violation: Violation) =>
              violation.id === context?.optimisticViolation?.id
                ? newViolation
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
      router.refresh()
    },
  })
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  CreateWaterSupplyData,
  createWaterSupplySchema,
} from "@/validation/water-supply"
import { PaginatedWaterSuppliesResponse } from "./find-many"

export async function createWaterSupply(
  payload: CreateWaterSupplyData,
): Promise<any> {
  return api.post<CreateWaterSupplyData>(
    "water-supplies/create-water-supply",
    payload,
  )
}

export const useCreateWaterSupply = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-water-supply"],
    mutationFn: async (payload: CreateWaterSupplyData) => {
      const sanitizedData = sanitizer<CreateWaterSupplyData>(
        {
          ...payload,
        },
        createWaterSupplySchema,
      )
      return await createWaterSupply(sanitizedData)
    },
    onMutate: async (newWaterSupply: any) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["water-supplies"] }),
        queryClient.cancelQueries({ queryKey: ["water-supplies-infinite"] }),
      ])

      const previousWaterSupplies = queryClient.getQueryData(["water-supplies"])
      const previousWaterSuppliesInfinite = queryClient.getQueryData([
        "water-supplies-infinite",
      ])

      const optimisticWaterSupply = {
        ...newWaterSupply,
        id: `temp-${Date.now()}`,
      }

      queryClient.setQueriesData<PaginatedWaterSuppliesResponse>(
        { queryKey: ["water-supplies"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          if (oldData.meta.page === 1) {
            const updatedData = [optimisticWaterSupply, ...oldData.data]
            const newTotalItems = oldData.meta.totalItems + 1

            return {
              ...oldData,
              data: updatedData,
              meta: {
                ...oldData.meta,
                totalItems: newTotalItems,
                totalPages: Math.ceil(newTotalItems / oldData.meta.limit),
                hasNextPage:
                  oldData.meta.page <
                  Math.ceil(newTotalItems / oldData.meta.limit),
                hasPrevPage: oldData.meta.page > 1,
              },
            }
          }

          return {
            ...oldData,
            meta: {
              ...oldData.meta,
              totalItems: oldData.meta.totalItems + 1,
              totalPages: Math.ceil(
                (oldData.meta.totalItems + 1) / oldData.meta.limit,
              ),
            },
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["water-supplies-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = [...oldData.pages]
          if (updatedPages.length > 0 && updatedPages[0]?.data) {
            updatedPages[0] = {
              ...updatedPages[0],
              data: [optimisticWaterSupply, ...updatedPages[0].data],
              meta: {
                ...updatedPages[0].meta,
                totalItems: updatedPages[0].meta.totalItems + 1,
                totalPages: Math.ceil(
                  (updatedPages[0].meta.totalItems + 1) /
                    updatedPages[0].meta.limit,
                ),
              },
            }
          }

          return {
            ...oldData,
            pages: updatedPages,
          }
        },
      )

      return {
        previousWaterSupplies,
        previousWaterSuppliesInfinite,
        optimisticWaterSupply,
      }
    },
    onSuccess: (newWaterSupply: any, _variables, _context) => {
      queryClient.setQueryData(
        ["water-supply", newWaterSupply.id],
        newWaterSupply,
      )

      queryClient.setQueriesData<PaginatedWaterSuppliesResponse>(
        { queryKey: ["water-supplies"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          const filteredData = oldData.data.filter(
            (item: any) => !item.id.toString().startsWith("temp-"),
          )

          if (oldData.meta.page === 1) {
            const updatedData = [
              newWaterSupply,
              ...filteredData.slice(0, oldData.meta.limit - 1),
            ]

            return {
              ...oldData,
              data: updatedData,
            }
          }

          return oldData
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["water-supplies-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = oldData.pages.map(
            (page: PaginatedWaterSuppliesResponse) => {
              const filteredData = page.data.filter(
                (item) => !item.id.toString().startsWith("temp-"),
              )

              return {
                ...page,
                data:
                  page.meta.page === 1
                    ? [newWaterSupply, ...filteredData]
                    : filteredData,
              }
            },
          )

          return {
            ...oldData,
            pages: updatedPages,
          }
        },
      )
    },
    onError: (error, _variables, context) => {
      if (context?.previousWaterSupplies) {
        queryClient.setQueryData(
          ["water-supplies"],
          context.previousWaterSupplies,
        )
      }
      if (context?.previousWaterSuppliesInfinite) {
        queryClient.setQueryData(
          ["water-supplies-infinite"],
          context.previousWaterSuppliesInfinite,
        )
      }
      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}

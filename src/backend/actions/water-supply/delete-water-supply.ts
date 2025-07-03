import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { PaginatedWaterSuppliesResponse } from "./find-many"

export async function deleteWaterSupply(supplyId: string) {
  return api.delete("water-supplies/delete-water-supply", {
    params: { id: supplyId },
  })
}

export const useDeleteWaterSupply = (supplyId: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-water-supply", supplyId],
    mutationFn: async () => {
      return await deleteWaterSupply(supplyId)
    },
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["water-supplies"] }),
        queryClient.cancelQueries({ queryKey: ["water-supplies-infinite"] }),
        queryClient.cancelQueries({ queryKey: ["water-supply", supplyId] }),
      ])

      const previousSupplies = queryClient.getQueryData(["water-supplies"])
      const previousSuppliesInfinite = queryClient.getQueryData([
        "water-supplies-infinite",
      ])
      const previousSupply = queryClient.getQueryData([
        "water-supply",
        supplyId,
      ])

      queryClient.setQueriesData<PaginatedWaterSuppliesResponse>(
        { queryKey: ["water-supplies"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.filter((supply) => supply.id !== supplyId),
            meta: {
              ...oldData.meta,
              totalItems: Math.max(0, oldData.meta.totalItems - 1),
              totalPages: Math.max(
                1,
                Math.ceil((oldData.meta.totalItems - 1) / oldData.meta.limit),
              ),
            },
          }
        },
      )

      queryClient.removeQueries({ queryKey: ["water-supply", supplyId] })

      return {
        previousSupplies,
        previousSuppliesInfinite,
        previousSupply,
      }
    },
    onSuccess: async (_data, _variables, _context) => {
      queryClient.setQueriesData<PaginatedWaterSuppliesResponse>(
        { queryKey: ["water-supplies"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.filter((supply) => supply.id !== supplyId),
            meta: {
              ...oldData.meta,
              totalItems: Math.max(0, oldData.meta.totalItems - 1),
              totalPages: Math.max(
                1,
                Math.ceil((oldData.meta.totalItems - 1) / oldData.meta.limit),
              ),
            },
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["water-supplies-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.filter((supply: any) => supply.id !== supplyId),
              meta: {
                ...page.meta,
                totalItems: Math.max(0, page.meta.totalItems - 1),
                totalPages: Math.max(
                  1,
                  Math.ceil((page.meta.totalItems - 1) / page.meta.limit),
                ),
              },
            })),
          }
        },
      )
    },
    onError: (error, _variables, context) => {
      if (context?.previousSupplies) {
        queryClient.setQueryData(["water-supplies"], context.previousSupplies)
      }
      if (context?.previousSuppliesInfinite) {
        queryClient.setQueryData(
          ["water-supplies-infinite"],
          context.previousSuppliesInfinite,
        )
      }
      if (context?.previousSupply) {
        queryClient.setQueryData(
          ["water-supply", supplyId],
          context.previousSupply,
        )
      }

      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}

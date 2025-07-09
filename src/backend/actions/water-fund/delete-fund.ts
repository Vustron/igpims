import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { PaginatedWaterFundsResponse } from "./find-many"

export async function deleteWaterFund(fundId: string) {
  return api.delete("water-funds/delete-water-fund", {
    params: { id: fundId },
  })
}

export const useDeleteWaterFund = (fundId: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-water-fund", fundId],
    mutationFn: async () => {
      return await deleteWaterFund(fundId)
    },
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["water-funds"] }),
        queryClient.cancelQueries({ queryKey: ["water-funds-infinite"] }),
        queryClient.cancelQueries({ queryKey: ["water-fund", fundId] }),
      ])

      const previousFunds = queryClient.getQueryData(["water-funds"])
      const previousFundsInfinite = queryClient.getQueryData([
        "water-funds-infinite",
      ])
      const previousFund = queryClient.getQueryData(["water-fund", fundId])

      queryClient.setQueriesData<PaginatedWaterFundsResponse>(
        { queryKey: ["water-funds"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.filter((fund) => fund.id !== fundId),
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

      queryClient.removeQueries({ queryKey: ["water-fund", fundId] })

      return {
        previousFunds,
        previousFundsInfinite,
        previousFund,
      }
    },
    onSuccess: async (_data, _variables, _context) => {
      queryClient.setQueriesData<PaginatedWaterFundsResponse>(
        { queryKey: ["water-funds"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.filter((fund) => fund.id !== fundId),
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
        { queryKey: ["water-funds-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.filter((fund: any) => fund.id !== fundId),
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
      if (context?.previousFunds) {
        queryClient.setQueryData(["water-funds"], context.previousFunds)
      }
      if (context?.previousFundsInfinite) {
        queryClient.setQueryData(
          ["water-funds-infinite"],
          context.previousFundsInfinite,
        )
      }
      if (context?.previousFund) {
        queryClient.setQueryData(["water-fund", fundId], context.previousFund)
      }

      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}

import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  UpdateWaterFundData,
  updateWaterFundSchema,
} from "@/validation/water-fund"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { WaterFundWithVendoLocation } from "./find-by-id"
import { PaginatedWaterFundsResponse } from "./find-many"

export async function updateWaterFund(
  id: string,
  payload: Partial<UpdateWaterFundData>,
): Promise<WaterFundWithVendoLocation> {
  return api.patch<Partial<UpdateWaterFundData>, WaterFundWithVendoLocation>(
    "water-funds/update-water-fund",
    payload,
    { params: { id } },
  )
}

export const useUpdateWaterFund = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-water-fund", id],
    mutationFn: async (payload: Partial<UpdateWaterFundData>) => {
      const sanitizedData = sanitizer<Partial<UpdateWaterFundData>>(
        payload,
        updateWaterFundSchema.partial(),
      )
      return await updateWaterFund(id, sanitizedData)
    },
    onMutate: async (updatedData) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["water-funds"] }),
        queryClient.cancelQueries({ queryKey: ["water-funds-infinite"] }),
        queryClient.cancelQueries({ queryKey: ["water-fund", id] }),
      ])

      const previousFund = queryClient.getQueryData<WaterFundWithVendoLocation>(
        ["water-fund", id],
      )
      const previousFunds = queryClient.getQueryData(["water-funds"])
      const previousFundsInfinite = queryClient.getQueryData([
        "water-funds-infinite",
      ])

      if (previousFund) {
        const optimisticFund = {
          ...previousFund,
          ...updatedData,
        }

        queryClient.setQueryData(["water-fund", id], optimisticFund)

        queryClient.setQueriesData<PaginatedWaterFundsResponse>(
          { queryKey: ["water-funds"] },
          (oldData: any) => {
            if (!oldData?.data) return oldData

            return {
              ...oldData,
              data: oldData.data.map((fund: any) =>
                fund.id === id ? optimisticFund : fund,
              ),
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
                data: page.data.map((fund: any) =>
                  fund.id === id ? optimisticFund : fund,
                ),
              })),
            }
          },
        )
      }

      return {
        previousFund,
        previousFunds,
        previousFundsInfinite,
      }
    },
    onSuccess: (
      updatedFund: WaterFundWithVendoLocation,
      _variables,
      _context,
    ) => {
      queryClient.setQueryData(["water-fund", id], updatedFund)

      queryClient.setQueriesData<PaginatedWaterFundsResponse>(
        { queryKey: ["water-funds"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.map((fund) =>
              fund.id === id ? updatedFund : fund,
            ),
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
              data: page.data.map((fund: any) =>
                fund.id === id ? updatedFund : fund,
              ),
            })),
          }
        },
      )
    },
    onError: (error, _variables, context) => {
      if (context?.previousFund) {
        queryClient.setQueryData(["water-fund", id], context.previousFund)
      }
      if (context?.previousFunds) {
        queryClient.setQueryData(["water-funds"], context.previousFunds)
      }
      if (context?.previousFundsInfinite) {
        queryClient.setQueryData(
          ["water-funds-infinite"],
          context.previousFundsInfinite,
        )
      }

      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}

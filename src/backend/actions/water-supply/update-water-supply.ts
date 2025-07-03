import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  UpdateWaterSupplyData,
  updateWaterSupplySchema,
} from "@/validation/water-supply"
import { WaterSupplyWithVendoLocation } from "./find-by-id"
import { PaginatedWaterSuppliesResponse } from "./find-many"

export async function updateWaterSupply(
  id: string,
  payload: Partial<UpdateWaterSupplyData>,
): Promise<WaterSupplyWithVendoLocation> {
  return api.patch<
    Partial<UpdateWaterSupplyData>,
    WaterSupplyWithVendoLocation
  >("water-supplies/update-water-supply", payload, { params: { id } })
}

export const useUpdateWaterSupply = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-water-supply", id],
    mutationFn: async (payload: Partial<UpdateWaterSupplyData>) => {
      const sanitizedData = sanitizer<Partial<UpdateWaterSupplyData>>(
        payload,
        updateWaterSupplySchema.partial(),
      )
      return await updateWaterSupply(id, sanitizedData)
    },
    onMutate: async (updatedData) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["water-supplies"] }),
        queryClient.cancelQueries({ queryKey: ["water-supplies-infinite"] }),
        queryClient.cancelQueries({ queryKey: ["water-supply", id] }),
      ])

      const previousSupply =
        queryClient.getQueryData<WaterSupplyWithVendoLocation>([
          "water-supply",
          id,
        ])
      const previousSupplies = queryClient.getQueryData(["water-supplies"])
      const previousSuppliesInfinite = queryClient.getQueryData([
        "water-supplies-infinite",
      ])

      if (previousSupply) {
        const optimisticSupply = {
          ...previousSupply,
          ...updatedData,
        }

        queryClient.setQueryData(["water-supply", id], optimisticSupply)

        queryClient.setQueriesData<PaginatedWaterSuppliesResponse>(
          { queryKey: ["water-supplies"] },
          (oldData: any) => {
            if (!oldData?.data) return oldData

            return {
              ...oldData,
              data: oldData.data.map((supply: any) =>
                supply.id === id ? optimisticSupply : supply,
              ),
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
                data: page.data.map((supply: any) =>
                  supply.id === id ? optimisticSupply : supply,
                ),
              })),
            }
          },
        )
      }

      return {
        previousSupply,
        previousSupplies,
        previousSuppliesInfinite,
      }
    },
    onSuccess: (
      updatedSupply: WaterSupplyWithVendoLocation,
      _variables,
      _context,
    ) => {
      queryClient.setQueryData(["water-supply", id], updatedSupply)

      queryClient.setQueriesData<PaginatedWaterSuppliesResponse>(
        { queryKey: ["water-supplies"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.map((supply) =>
              supply.id === id ? updatedSupply : supply,
            ),
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
              data: page.data.map((supply: any) =>
                supply.id === id ? updatedSupply : supply,
              ),
            })),
          }
        },
      )
    },
    onError: (error, _variables, context) => {
      if (context?.previousSupply) {
        queryClient.setQueryData(["water-supply", id], context.previousSupply)
      }
      if (context?.previousSupplies) {
        queryClient.setQueryData(["water-supplies"], context.previousSupplies)
      }
      if (context?.previousSuppliesInfinite) {
        queryClient.setQueryData(
          ["water-supplies-infinite"],
          context.previousSuppliesInfinite,
        )
      }

      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}

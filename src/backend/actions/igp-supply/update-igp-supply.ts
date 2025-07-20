import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  UpdateIgpSupplyPayload,
  updateIgpSupplySchema,
} from "@/validation/igp-supply"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { IgpSupplyWithRelations } from "./find-by-id"
import { PaginatedIgpSupplyResponse } from "./find-many"

export async function updateIgpSupply(
  id: string,
  payload: Partial<UpdateIgpSupplyPayload>,
): Promise<IgpSupplyWithRelations> {
  return api.patch<Partial<UpdateIgpSupplyPayload>, IgpSupplyWithRelations>(
    "igp-supplies/update-igp-supply",
    payload,
    { params: { id } },
  )
}

export const useUpdateIgpSupply = (id: string, igpId?: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-igp-supply", id],
    mutationFn: async (payload: Partial<UpdateIgpSupplyPayload>) => {
      const sanitizedData = sanitizer<Partial<UpdateIgpSupplyPayload>>(
        payload,
        updateIgpSupplySchema.partial(),
      )
      return await updateIgpSupply(id, sanitizedData)
    },
    onMutate: async (updatedData) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["igp-transactions"] }),
        queryClient.cancelQueries({ queryKey: ["igp-supplies", id] }),
        queryClient.cancelQueries({ queryKey: ["igp-supplies"] }),
        queryClient.cancelQueries({ queryKey: ["igp", igpId] }),
        queryClient.cancelQueries({ queryKey: ["igps"] }),
      ])

      const previousSupply = queryClient.getQueryData<IgpSupplyWithRelations>([
        "igp-supply",
        id,
      ])
      const previousSupplies =
        queryClient.getQueryData<PaginatedIgpSupplyResponse>([
          "igp-supplies",
          igpId,
        ])
      const previousIgp = queryClient.getQueryData(["igp", igpId])

      if (previousSupply) {
        const optimisticSupply = {
          ...previousSupply,
          ...updatedData,
        }

        queryClient.setQueryData(["igp-supply", id], optimisticSupply)

        if (igpId) {
          queryClient.setQueryData(
            ["igp-supplies", igpId],
            (oldData: PaginatedIgpSupplyResponse | undefined) => {
              if (!oldData?.data) return oldData
              return {
                ...oldData,
                data: oldData.data.map((supply) =>
                  supply.id === id ? optimisticSupply : supply,
                ),
              }
            },
          )
        }

        if (igpId && previousIgp) {
          const quantitySoldDiff =
            updatedData.quantitySold !== undefined
              ? updatedData.quantitySold - previousSupply.quantitySold
              : 0
          const revenueDiff =
            updatedData.totalRevenue !== undefined
              ? updatedData.totalRevenue - previousSupply.totalRevenue
              : 0

          if (quantitySoldDiff !== 0 || revenueDiff !== 0) {
            queryClient.setQueryData(["igp", igpId], (oldIgp: any) => ({
              ...oldIgp,
              totalSold: oldIgp.totalSold + quantitySoldDiff,
              igpRevenue: oldIgp.igpRevenue + revenueDiff,
            }))
          }
        }
      }

      return {
        previousSupply,
        previousSupplies,
        previousIgp,
      }
    },
    onSuccess: (updatedSupply) => {
      queryClient.setQueryData(["igp-supply", id], updatedSupply)

      if (igpId) {
        queryClient.setQueryData(
          ["igp-supplies", igpId],
          (oldData: PaginatedIgpSupplyResponse | undefined) => {
            if (!oldData?.data) return oldData
            return {
              ...oldData,
              data: oldData.data.map((supply) =>
                supply.id === id ? updatedSupply : supply,
              ),
            }
          },
        )
      }
    },
    onError: (error, _variables, context) => {
      if (context?.previousSupply) {
        queryClient.setQueryData(["igp-supply", id], context.previousSupply)
      }

      if (context?.previousSupplies && igpId) {
        queryClient.setQueryData(
          ["igp-supplies", igpId],
          context.previousSupplies,
        )
      }

      if (context?.previousIgp && igpId) {
        queryClient.setQueryData(["igp", igpId], context.previousIgp)
      }

      catchError(error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["igp-transactions"] })
      queryClient.invalidateQueries({ queryKey: ["igp-supplies", id] })
      queryClient.invalidateQueries({ queryKey: ["igp-supplies"] })
      queryClient.invalidateQueries({ queryKey: ["igp", igpId] })
      queryClient.invalidateQueries({ queryKey: ["igps"] })
      router.refresh()
    },
  })
}

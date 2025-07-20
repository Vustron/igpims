import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { IgpSupplyWithRelations } from "./find-by-id"
import { PaginatedIgpSupplyResponse } from "./find-many"

export async function deleteIgpSupply(id: string) {
  return api.delete<IgpSupplyWithRelations>("igp-supplies/delete-igp-supply", {
    params: { id },
  })
}

export const useDeleteIgpSupply = (id: string, igpId?: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-igp-supply", id],
    mutationFn: async () => {
      return await deleteIgpSupply(id)
    },
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["igp-supply", id] }),
        queryClient.cancelQueries({ queryKey: ["igp-supplies"] }),
        queryClient.cancelQueries({ queryKey: ["igp-transactions"] }),
        queryClient.cancelQueries({ queryKey: ["igp", igpId] }),
        queryClient.cancelQueries({ queryKey: ["igps"] }),
      ])

      const previousSupply = queryClient.getQueryData<IgpSupplyWithRelations>([
        "igp-supply",
        id,
      ])
      const previousSupplies =
        queryClient.getQueryData<PaginatedIgpSupplyResponse>(["igp-supplies"])
      const previousIgp = queryClient.getQueryData(["igp", igpId])

      if (previousSupplies) {
        queryClient.setQueryData(
          ["igp-supplies"],
          (oldData: PaginatedIgpSupplyResponse | undefined) => {
            if (!oldData?.data) return oldData
            return {
              ...oldData,
              data: oldData.data.filter((supply) => supply.id !== id),
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
      }

      if (igpId && previousIgp && previousSupply) {
        queryClient.setQueryData(["igp", igpId], (oldIgp: any) => ({
          ...oldIgp,
          totalSold: oldIgp.totalSold - (previousSupply.quantitySold || 0),
          igpRevenue: oldIgp.igpRevenue - (previousSupply.totalRevenue || 0),
        }))
      }

      return {
        previousSupply,
        previousSupplies,
        previousIgp,
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: ["igp-supply", id] })
      queryClient.invalidateQueries({ queryKey: ["igp-supplies"] })
      queryClient.invalidateQueries({ queryKey: ["igp-transactions"] })
      queryClient.invalidateQueries({ queryKey: ["igp", igpId] })
      queryClient.invalidateQueries({ queryKey: ["igps"] })
    },
    onError: (error, _variables, context) => {
      if (context?.previousSupply) {
        queryClient.setQueryData(["igp-supply", id], context.previousSupply)
      }

      if (context?.previousSupplies) {
        queryClient.setQueryData(["igp-supplies"], context.previousSupplies)
      }

      if (context?.previousIgp && igpId) {
        queryClient.setQueryData(["igp", igpId], context.previousIgp)
      }

      return catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}

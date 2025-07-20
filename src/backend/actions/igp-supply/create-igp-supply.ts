import { IgpSupply } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  CreateIgpSupplyPayload,
  createIgpSupplySchema,
} from "@/validation/igp-supply"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

export async function createIgpSupply(
  payload: CreateIgpSupplyPayload,
): Promise<IgpSupply> {
  return api.post<typeof payload, IgpSupply>(
    "igp-supplies/create-igp-supply",
    payload,
  )
}

export const useCreateIgpSupply = (igpId?: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-igp-supply"],
    mutationFn: async (payload: CreateIgpSupplyPayload) => {
      const sanitizedData = sanitizer<CreateIgpSupplyPayload>(
        {
          ...payload,
          igpId: igpId || payload.igpId,
        },
        createIgpSupplySchema,
      )
      return await createIgpSupply(sanitizedData)
    },
    onMutate: async (newSupply) => {
      await queryClient.cancelQueries({
        queryKey: ["igp-supplies", newSupply.igpId],
      })

      const previousSupplies = queryClient.getQueryData([
        "igp-supplies",
        newSupply.igpId,
      ])

      const optimisticSupply = {
        ...newSupply,
        id: `temp-${Date.now()}`,
        supplyDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        quantitySold: newSupply.quantitySold || 0,
        expenses: newSupply.expenses || 0,
        totalRevenue: newSupply.totalRevenue || 0,
      }

      queryClient.setQueryData(
        ["igp-supplies", newSupply.igpId],
        (oldData: IgpSupply[] | undefined) => {
          return oldData ? [optimisticSupply, ...oldData] : [optimisticSupply]
        },
      )

      return { previousSupplies }
    },
    onSuccess: (newSupply, _variables, _context) => {
      queryClient.setQueryData(
        ["igp-supplies", newSupply.igpId],
        (oldData: IgpSupply[] | undefined) => {
          if (!oldData) return [newSupply]
          return oldData.map((s) =>
            s.id.toString().startsWith("temp-") ? newSupply : s,
          )
        },
      )
    },
    onError: (error, variables, context) => {
      if (context?.previousSupplies) {
        queryClient.setQueryData(
          ["igp-supplies", variables.igpId],
          context.previousSupplies,
        )
      }

      catchError(error)
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["igp-supplies", variables?.igpId],
      })
      queryClient.invalidateQueries({ queryKey: ["igp-supplies"] })
      queryClient.invalidateQueries({ queryKey: ["igp-transactions"] })
      queryClient.invalidateQueries({ queryKey: ["igp", variables?.igpId] })
      queryClient.invalidateQueries({ queryKey: ["igps"] })
      router.refresh()
    },
  })
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { WaterVendo } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  UpdateWaterVendoData,
  updateWaterVendoSchema,
} from "@/validation/water-vendo"
import { PaginatedWaterVendosResponse } from "./find-many"

export async function updateWaterVendo(
  id: string,
  payload: Partial<UpdateWaterVendoData>,
): Promise<WaterVendo> {
  return api.patch<Partial<UpdateWaterVendoData>, WaterVendo>(
    "water-vendos/update-water-vendo",
    payload,
    { params: { id } },
  )
}

export const useUpdateWaterVendo = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-water-vendo", id],
    mutationFn: async (payload: Partial<UpdateWaterVendoData>) => {
      const sanitizedData = sanitizer<Partial<UpdateWaterVendoData>>(
        payload,
        updateWaterVendoSchema.partial(),
      )
      return await updateWaterVendo(id, sanitizedData)
    },
    onMutate: async (updatedData) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["water-vendos"] }),
        queryClient.cancelQueries({ queryKey: ["water-vendos-infinite"] }),
        queryClient.cancelQueries({ queryKey: ["water-vendo", id] }),
      ])

      const previousVendo = queryClient.getQueryData<WaterVendo>([
        "water-vendo",
        id,
      ])
      const previousVendos = queryClient.getQueryData(["water-vendos"])
      const previousVendosInfinite = queryClient.getQueryData([
        "water-vendos-infinite",
      ])

      if (previousVendo) {
        const optimisticVendo: WaterVendo = {
          ...previousVendo,
          ...updatedData,
          updatedAt: new Date(),
        }

        queryClient.setQueryData(["water-vendo", id], optimisticVendo)

        queryClient.setQueriesData<PaginatedWaterVendosResponse>(
          { queryKey: ["water-vendos"] },
          (oldData) => {
            if (!oldData?.data) return oldData

            return {
              ...oldData,
              data: oldData.data.map((vendo) =>
                vendo.id === id ? optimisticVendo : vendo,
              ),
            }
          },
        )

        queryClient.setQueriesData(
          { queryKey: ["water-vendos-infinite"] },
          (oldData: any) => {
            if (!oldData?.pages) return oldData

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: page.data.map((vendo: any) =>
                  vendo.id === id ? optimisticVendo : vendo,
                ),
              })),
            }
          },
        )
      }

      return {
        previousVendo,
        previousVendos,
        previousVendosInfinite,
      }
    },
    onSuccess: (updatedVendo: WaterVendo, _variables, _context) => {
      queryClient.setQueryData(["water-vendo", id], updatedVendo)

      queryClient.setQueriesData<PaginatedWaterVendosResponse>(
        { queryKey: ["water-vendos"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.map((vendo) =>
              vendo.id === id ? updatedVendo : vendo,
            ),
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["water-vendos-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((vendo: any) =>
                vendo.id === id ? updatedVendo : vendo,
              ),
            })),
          }
        },
      )
    },
    onError: (error, _variables, context) => {
      if (context?.previousVendo) {
        queryClient.setQueryData(["water-vendo", id], context.previousVendo)
      }
      if (context?.previousVendos) {
        queryClient.setQueryData(["water-vendos"], context.previousVendos)
      }
      if (context?.previousVendosInfinite) {
        queryClient.setQueryData(
          ["water-vendos-infinite"],
          context.previousVendosInfinite,
        )
      }

      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}

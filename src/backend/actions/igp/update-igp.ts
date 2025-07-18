import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import { UpdateIgpPayload, updateIgpSchema } from "@/validation/igp"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { IgpWithProjectLeadData, PaginatedIgpResponse } from "./find-many"

export async function updateIgp(
  id: string,
  payload: Partial<UpdateIgpPayload>,
): Promise<IgpWithProjectLeadData> {
  return api.patch<Partial<UpdateIgpPayload>, IgpWithProjectLeadData>(
    "igps/update-igp",
    payload,
    {
      params: { id },
    },
  )
}

export const useUpdateIgp = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-igp", id],
    mutationFn: async (payload: Partial<UpdateIgpPayload>) => {
      const sanitizedData = sanitizer<Partial<UpdateIgpPayload>>(
        payload,
        updateIgpSchema.partial(),
      )
      return await updateIgp(id, sanitizedData)
    },
    onMutate: async (updatedData) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["igp", id] }),
        queryClient.cancelQueries({ queryKey: ["igps"] }),
        queryClient.cancelQueries({ queryKey: ["igps-infinite"] }),
      ])

      const previousIgp = queryClient.getQueryData<IgpWithProjectLeadData>([
        "igp",
        id,
      ])
      const previousIgps = queryClient.getQueryData(["igps"])
      const previousIgpsInfinite = queryClient.getQueryData(["igps-infinite"])

      if (previousIgp) {
        const optimisticIgp = {
          ...previousIgp,
          ...updatedData,
          updatedAt: new Date(),
        }

        queryClient.setQueryData(["igp", id], optimisticIgp)

        queryClient.setQueriesData<PaginatedIgpResponse>(
          { queryKey: ["igps"] },
          (oldData: any) => {
            if (!oldData?.data) return oldData
            return {
              ...oldData,
              data: oldData.data.map((igp: any) =>
                igp.id === id ? optimisticIgp : igp,
              ),
            }
          },
        )

        queryClient.setQueriesData(
          { queryKey: ["igps-infinite"] },
          (oldData: any) => {
            if (!oldData?.pages) return oldData
            return {
              ...oldData,
              pages: oldData.pages.map((page: PaginatedIgpResponse) => ({
                ...page,
                data: page.data.map((igp) =>
                  igp.id === id ? optimisticIgp : igp,
                ),
              })),
            }
          },
        )
      }

      return {
        previousIgp,
        previousIgps,
        previousIgpsInfinite,
      }
    },
    onSuccess: (updatedIgp: IgpWithProjectLeadData) => {
      queryClient.setQueryData(["igp", id], updatedIgp)

      queryClient.setQueriesData<PaginatedIgpResponse>(
        { queryKey: ["igps"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData
          return {
            ...oldData,
            data: oldData.data.map((igp: any) =>
              igp.id === id ? updatedIgp : igp,
            ),
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["igps-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page: PaginatedIgpResponse) => ({
              ...page,
              data: page.data.map((igp) => (igp.id === id ? updatedIgp : igp)),
            })),
          }
        },
      )
    },
    onError: (error, _variables, context) => {
      if (context?.previousIgp) {
        queryClient.setQueryData(["igp", id], context.previousIgp)
      }
      if (context?.previousIgps) {
        queryClient.setQueryData(["igps"], context.previousIgps)
      }
      if (context?.previousIgpsInfinite) {
        queryClient.setQueryData(
          ["igps-infinite"],
          context.previousIgpsInfinite,
        )
      }
      catchError(error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["igps"] })
      queryClient.invalidateQueries({ queryKey: ["igp", id] })
      queryClient.invalidateQueries({ queryKey: ["igps-infinite"] })
      router.refresh()
    },
  })
}

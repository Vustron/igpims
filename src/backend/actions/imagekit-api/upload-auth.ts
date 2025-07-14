import { api } from "@/backend/helpers/api-client"
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query"

export interface ImagekitUploadAuth {
  token: string
  expire: number
  signature: string
  publicKey: string
}

export async function getImagekitUploadAuth(): Promise<ImagekitUploadAuth> {
  return api.get<ImagekitUploadAuth>("imagekit-api/upload-auth")
}

export async function preGetImagekitUploadAuth() {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["imagekit-upload-auth"],
      queryFn: async () => await getImagekitUploadAuth(),
    })
  }
}

export const useGetImagekitUploadAuth = () => {
  return useQuery({
    queryKey: ["imagekit-upload-auth"],
    queryFn: async () => await getImagekitUploadAuth(),
  })
}

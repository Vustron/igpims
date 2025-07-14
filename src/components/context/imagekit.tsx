import { env } from "@/config/env"
import { ImageKitProvider } from "@imagekit/next"

export const ImagekitProviderContext = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ImageKitProvider urlEndpoint={`${env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}`}>
      {children}
    </ImageKitProvider>
  )
}

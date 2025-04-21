"use client"

import { ErrorBoundary } from "react-error-boundary"
import { Loader2, ServerCrash } from "lucide-react"
import toast from "react-hot-toast"
import { Suspense } from "react"

import { Button } from "@/components/ui/buttons/button"

export const LoadingFallback = () => {
  return (
    <div className="flex h-[500px] flex-col items-center justify-center">
      <Loader2 className="size-20 animate-spin" />
    </div>
  )
}

export const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center text-red-500"
      role="alert"
    >
      <div className="flex flex-col items-center justify-center">
        <ServerCrash className="my-4 size-7 text-zinc-500" />
        <p className="font-semibold text-lg">Something went wrong</p>
        <p className="font-semibold text-lg">{error.message}</p>
        <Button
          className="mt-4"
          onClick={() => window.location.assign(window.location.origin)}
        >
          Refresh
        </Button>
      </div>
    </div>
  )
}

const FallbackBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        toast.error(`An error occurred: ${error.message}`)
      }}
    >
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default FallbackBoundary

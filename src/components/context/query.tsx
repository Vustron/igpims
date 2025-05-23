"use client"

import {
  isServer,
  QueryClient,
  QueryClientProvider,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ErrorBoundary } from "react-error-boundary"

import { ErrorFallback } from "@/components/ui/fallbacks"

import { useState, useEffect } from "react"

import React from "react"

// init query dev tools
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
)

// init creation of query client
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

// get query client
function getQueryClient() {
  // if server component make a client
  if (isServer) {
    return makeQueryClient()
  }

  // if the window is undefined make a client
  if (typeof window === "undefined") {
    return makeQueryClient()
  }

  // if the there's no browser query client make one
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

export const QueryProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // devtools state
  const [showDevtools, setShowDevtools] = useState(false)

  // query client
  const queryClient = getQueryClient()

  useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen />
        {showDevtools && (
          <React.Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </React.Suspense>
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

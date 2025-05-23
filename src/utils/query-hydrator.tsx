import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query"

export type PrefetchFunction = (
  queryClient: QueryClient,
) => Promise<any | undefined>

interface QueryHydratorProps {
  children: React.ReactNode
  prefetchFns?: PrefetchFunction[]
}

async function prefetchQueries(
  queryClient: QueryClient,
  prefetchFns: PrefetchFunction[] = [],
) {
  for (const prefetch of prefetchFns) {
    const queryOptions = await prefetch(queryClient)
    if (queryOptions?.queryKey) {
      await queryClient.prefetchQuery({
        ...queryOptions,
        queryKey: queryOptions.queryKey,
      })
    }
  }
  return queryClient
}

export const QueryHydrator = async ({
  children,
  prefetchFns = [],
}: QueryHydratorProps) => {
  const queryClient = new QueryClient()
  await prefetchQueries(queryClient, prefetchFns)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

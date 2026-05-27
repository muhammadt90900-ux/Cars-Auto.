// apps/web/src/lib/queryClient.ts
// Centralised TanStack Query client with sensible caching defaults.
// Import this singleton everywhere — never create new QueryClient() per render.

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep data fresh for 60 s before a background refetch
      staleTime: 60_000,
      // Hold unused cached data for 5 min before garbage-collecting
      gcTime: 5 * 60_000,
      // Retry once on network failure, not on 4xx
      retry: (failureCount, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
});

import PostService from "@/src/services/post-service";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useFeed(params?: { pageSize?: number }) {
  const pageSize = params?.pageSize ?? 10;

  return useInfiniteQuery({
    queryKey: ["feed", pageSize],
    queryFn: async ({ pageParam }) =>
      await PostService.list({ cursor: pageParam ?? null, limit: pageSize }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

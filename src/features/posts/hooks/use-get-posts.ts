import { postKey } from '@/src/lib/query-kye'
import PostService from '@/src/services/post-service'
import { useQuery } from '@tanstack/react-query'

type Options = {
  queryKeyLabel?: string
  filters?: FilterQuery
}

export default function useGetPosts(options?: Options) {
  const { filters, queryKeyLabel } = options || {}

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: postKey.list({
      label: queryKeyLabel,
      ...(filters || {}),
    }),
    async queryFn({ queryKey }) {
      const { search, companyId } = JSON.parse(queryKey[2].filters)
      const filters: FilterQuery = { limit: 30 }

      if (search) filters.search = search
      if (companyId) filters.companyId = companyId

      return PostService.getAll(filters)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return { posts: data?.data || [], isLoading, isRefetching, refetch }
}

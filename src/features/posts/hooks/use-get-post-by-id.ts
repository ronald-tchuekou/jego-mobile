import { postKey } from '@/src/lib/query-kye'
import PostService from '@/src/services/post-service'
import { useQuery } from '@tanstack/react-query'

export default function useGetPostById(id: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: postKey.detail(id),
    async queryFn({ queryKey }) {
      const postId = queryKey[2]
      return PostService.getById(postId)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return { data, isLoading, refetch }
}

'use client'

import { postCommentKey } from '@/src/lib/query-kye'
import PostCommentService, { PostCommentModel } from '@/src/services/post-comment-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useQuery } from '@tanstack/react-query'

export default function useGetPostComments(postId: string) {
  const auth = useAuthStore((s) => s.auth)

  const { isLoading, data, refetch } = useQuery({
    queryKey: postCommentKey.list({ postId }),
    queryFn: async ({ queryKey }) => {
      const parsed = JSON.parse((queryKey[2] as any).filters)
      const token = auth?.token || ''
      const result = await PostCommentService.getPostComments({
        postId: parsed.postId,
        token,
      })
      return result?.data as PaginateResponse<PostCommentModel>
    },
  })

  return {
    isLoading,
    refetch,
    comments: data?.data || [],
    total: data?.meta.total || 0,
    page: data?.meta.currentPage || 1,
    totalPage: data?.meta.lastPage || 1,
  }
}

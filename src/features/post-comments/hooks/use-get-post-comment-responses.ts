'use client'

import { useQuery } from '@tanstack/react-query'
import { postCommentResponseKey } from '@/src/lib/query-kye'
import PostCommentResponseService, { PostCommentResponseModel } from '@/src/services/post-comment-response-service'
import { useAuthStore } from '@/src/stores/auth-store'

export default function useGetPostCommentResponses(postCommentId: string) {
  const auth = useAuthStore((s) => s.auth)

  const { isLoading, data, refetch } = useQuery({
    queryKey: postCommentResponseKey.list({ postCommentId }),
    queryFn: async ({ queryKey }) => {
      const parsed = JSON.parse((queryKey[2] as any).filters)
      const token = auth?.token || ''
      const result = await PostCommentResponseService.getPostCommentResponses({
        postCommentId: parsed.postCommentId,
        token,
      })
      return result?.data as PaginateResponse<PostCommentResponseModel>
    },
  })

  return {
    isLoading: isLoading,
    refetch,
    comments: data?.data || [],
    total: data?.meta.total || 0,
    page: data?.meta.currentPage || 1,
    totalPage: data?.meta.lastPage || 1,
  }
}

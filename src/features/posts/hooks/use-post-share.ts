'use client'

import { postLikeKey } from '@/src/lib/query-kye'
import PostShareService from '@/src/services/post-share-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

export default function usePostShare(postId: string) {
  const auth = useAuthStore((s) => s.auth)

  const {
    isLoading,
    data: share = null,
    refetch,
  } = useQuery({
    queryKey: postLikeKey.detail(postId),
    async queryFn({ queryKey }) {
      const postId = queryKey[2]
      const userId = auth?.user?.id
      const token = auth?.token

      if (!userId || !token) return null
      return PostShareService.getUserShare(userId, postId, token)
    },
  })

  const { isPending: isCreating, mutate: _createShare } = useMutation({
    mutationFn: async (postId: string) => {
      if (!auth?.token) throw new Error('Token not found')
      return PostShareService.createOne({ postId }, auth.token)
    },
    onSuccess: () => {
      refetch()
    },
  })

  const createShare = useCallback(() => {
    if (share) return
    _createShare(postId)
  }, [postId, _createShare, share])

  return {
    loadingShare: isLoading,
    isPending: isCreating,
    createShare,
    share,
  }
}

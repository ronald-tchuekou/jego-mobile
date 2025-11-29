import { postCommentKey, postCommentResponseKey, postKey } from '@/src/lib/query-kye'
import PostCommentResponseService, { PostCommentResponseModel } from '@/src/services/post-comment-response-service'
import PostCommentService, { PostCommentModel } from '@/src/services/post-comment-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

type Props = { onSuccess?: VoidFunction }

export function useEditPostComment(props?: Props) {
  const { onSuccess } = props || {}

  const auth = useAuthStore((s) => s.auth)
  const queryClient = useQueryClient()

  const onMutateSuccess = (data: PostCommentModel | PostCommentResponseModel) => {
    onSuccess?.()
    queryClient.invalidateQueries({ queryKey: postKey.all }).then()
    queryClient.invalidateQueries({ queryKey: postCommentKey.all }).then()

    const postCommentId = (data as any).postCommentId
    if (postCommentId)
      queryClient.invalidateQueries({ queryKey: postCommentResponseKey.list({ postCommentId }) }).then()
  }

  const { mutate: createPostComment, isPending: isCreatingPostComment } = useMutation({
    mutationFn: async (body: { comment: string; postId: string; parentId: string | null }) => {
      if (!auth?.token) throw new Error('Vous devez être connecté.')

      if (body.parentId)
        return PostCommentResponseService.createOne(
          {
            postCommentId: body.parentId,
            comment: body.comment,
          },
          auth.token,
        )

      return PostCommentService.createOne(body, auth.token)
    },
    onSuccess: onMutateSuccess,
    onError: (e) => {
      Toast.show({
        text1: 'Une erreur est survenue',
        text2: e.message || 'Une erreur est survenue.',
        type: 'error',
        visibilityTime: 6000,
      })
    },
  })

  const { mutate: editPostComment, isPending: isEditingPostComment } = useMutation({
    mutationFn: async (body: { comment: string; id: string; isResponse: boolean }) => {
      if (!auth?.token) throw new Error('Vous devez être connecté.')

      if (body.isResponse) return PostCommentResponseService.editOne(body, auth.token)

      return PostCommentService.editOne(body, auth.token)
    },
    onSuccess: onMutateSuccess,
    onError: (e) => {
      Toast.show({
        text1: 'Une erreur est survenue',
        text2: e.message || 'Une erreur est survenue.',
        type: 'error',
        visibilityTime: 6000,
      })
    },
  })

  return {
    createPostComment,
    isCreatingPostComment,
    editPostComment,
    isEditingPostComment,
  }
}

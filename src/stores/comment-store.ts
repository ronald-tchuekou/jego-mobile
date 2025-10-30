import { create } from 'zustand'
import { PostCommentModel } from '@/src/services/post-comment-service'
import { PostCommentResponseModel } from '@/src/services/post-comment-response-service'

export type CommentState = {
  comment: PostCommentModel | PostCommentResponseModel | null
  parentId: string | null
  setParentId: (parentId: string) => void
  editComment: (comment: PostCommentModel | PostCommentResponseModel) => void
  clearState: VoidFunction
}

export const useCommentStore = create<CommentState>((set) => ({
  comment: null,
  parentId: null,
  editComment(comment) {
    set((state) => ({ ...state, comment }))
  },
  setParentId(parentId) {
    set((state) => ({
      ...state,
      parentId,
    }))
  },
  clearState() {
    set({ comment: null, parentId: null })
  },
}))

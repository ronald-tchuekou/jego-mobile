import { fetchHelper } from '../lib/fetch-helper'
import { UserModel } from './auth-service'
import { PostModel } from './post-service'

export type PostCommentModel = {
  id: string
  postId: string
  userId: string
  comment: string
  likeCount: number
  user: UserModel
  post: PostModel
  createdAt: string
  updatedAt: string
}

export type CreatePostCommentDto = {
  postId: string
  comment: string
}

const PostCommentService = {
  async getPostComments(options: { postId: string; token: string; page?: number; limit?: number }) {
    const { data, error } = await fetchHelper<{
      data: PaginateResponse<PostCommentModel>
    }>(`/post-comments/${options.postId}?page=${options.page || 1}&limit=${options.limit || 10}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async createOne(body: CreatePostCommentDto, token: string) {
    const { data, error } = await fetchHelper<{ data: PostCommentModel }>(`/post-comments/${body.postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    if (error) throw new Error(error)
    if (!data?.data) throw new Error('Une erreur est survenue lors de la création du commentaire.')
    return data.data
  },

  async deleteOne(id: string, token: string) {
    const { data, error } = await fetchHelper<{ message: string }>(`/post-comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async editOne(param: { id: string; comment: string }, token: string) {
    const { data, error } = await fetchHelper<{ data: PostCommentModel }>(`/post-comments/${param.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(param),
    })
    if (error) throw new Error(error)
    if (!data?.data) throw new Error('Une erreur est survenue lors de la modification du commentaire.')
    return data.data
  },
}

export default PostCommentService

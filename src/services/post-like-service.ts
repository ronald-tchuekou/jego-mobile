import { fetchHelper } from '../lib/fetch-helper'

export type PostLikeModel = {
  postId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export type CreatePostLikeDto = {
  postId: string
}

const PostLikeService = {
  async getUserLike(userId: string, postId: string, token: string) {
    const { data, error } = await fetchHelper<{ data: PostLikeModel }>(`/post-likes/${postId}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data?.data || null
  },

  async createOne(body: CreatePostLikeDto, token: string) {
    const { data, error } = await fetchHelper<{ data: PostLikeModel }>(`/post-likes/${body.postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    if (!data?.data) throw new Error('Une erreur est survenue lors de la création du like.')
    return data.data
  },

  async deleteOne(postId: string, token: string) {
    const { data, error } = await fetchHelper<{ message: string }>(`/post-likes/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },
}

export default PostLikeService

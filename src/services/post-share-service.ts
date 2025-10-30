import { fetchHelper } from '../lib/fetch-helper'

export type PostShareModel = {
  postId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export type CreatePostShareDto = {
  postId: string
}

const PostShareService = {
  async getUserShare(userId: string, postId: string, token: string) {
    const { data, error } = await fetchHelper<{ data: PostShareModel }>(`/post-shares/${postId}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data?.data || null
  },

  async createOne(body: CreatePostShareDto, token: string) {
    const { data, error } = await fetchHelper<{ data: PostShareModel }>(`/post-shares/${body.postId}`, {
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
}

export default PostShareService

import { fetchHelper } from '@/src/lib/fetch-helper'
import type { UserModel } from '@/src/services/auth-service'

const UserService = {
  async revalidateMe(token: string) {
    const { data, error } = await fetchHelper<UserModel>('/me/revalidate-token', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data!
  },

  async getMe(token: string) {
    const { data, error } = await fetchHelper<{ user: UserModel }>('/me', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data!.user
  },
}

export default UserService

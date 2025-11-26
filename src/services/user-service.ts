import { fetchHelper } from '@/src/lib/fetch-helper'
import type { UserModel, UserRole } from '@/src/services/auth-service'
import { objectToQueryString } from '../lib/utils'

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

  async count(token: string, search: string = '') {
    const { data, error } = await fetchHelper<{ count: number }>(`/users/count?search=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data?.count
  },

  async updateMe(body: Partial<UserModel>, token: string) {
    const { data, error } = await fetchHelper<{ user: UserModel }>('/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    if (error) throw new Error(error)
    return data?.user
  },

  async updateMeEmail(body: { email: string; password: string }, token: string) {
    const { data, error } = await fetchHelper<{
      user: UserModel
      message: string
    }>('/me/update-email', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async resendMeEmailVerification(token: string) {
    const { data, error } = await fetchHelper<{ message: string }>('/me/resend-email-verification', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async verifyNewEmail(code: string, token: string) {
    const { data, error } = await fetchHelper<{
      user: UserModel
      message: string
    }>('/me/verify-new-email', {
      method: 'POST',
      body: JSON.stringify({ token: code }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async updateMePassword(
    body: {
      currentPassword: string
      newPassword: string
      confirmNewPassword: string
    },
    token: string,
  ) {
    const { data, error } = await fetchHelper<{
      user: UserModel
      message: string
    }>('/me/update-password', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async deleteMe(body: { password: string }, token: string) {
    const { data, error } = await fetchHelper<{ message: string }>('/me/delete-account', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async getUsers(filter: FilterQuery & { role?: UserRole; status?: 'active' | 'blocked' }, token: string) {
    const query = objectToQueryString(filter)

    const { data, error } = await fetchHelper<PaginateResponse<UserModel>>(`/users?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async getUserById(id: string, token: string) {
    const { data, error } = await fetchHelper<{ data: UserModel }>(`/users/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data?.data || null
  },

  async deleteUser(id: string, token: string) {
    const { data, error } = await fetchHelper<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async toggleBlockUser(id: string, token: string) {
    const { data, error } = await fetchHelper<{ user: UserModel }>(`/users/${id}/toggle-block`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data?.user
  },

  async updateMeImageProfile(image: File, token: string) {
    const formData = new FormData()
    formData.append('image', image, `${Date.now()}.${image.type.split('/')[1]}`)

    const { data, error } = await fetchHelper<{ user: UserModel }>('/me/image-profile', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data?.user
  },

  async chartData(token: string, range?: { startDate: string; endDate: string }) {
    let query = ''
    if (range) {
      query = objectToQueryString(range)
    }
    const { data, error } = await fetchHelper<{
      data: { date: string; count: number }[]
      startDate: string
      endDate: string
    }>(`/users/count-per-day?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },
}

export default UserService

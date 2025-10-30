import { fetchHelper } from '../lib/fetch-helper'
import { objectToQueryString } from '../lib/utils'
import { UserModel } from './auth-service'

export enum NotificationType {
  INFO = 'info',
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export type NotificationModel = {
  _id: string
  title: string
  message: string
  userId: string
  read: boolean
  type: NotificationType
  createdAt: Date
  updatedAt: Date
  user: UserModel
}

const NotificationService = {
  async getNoReadCount(token: string) {
    return fetchHelper<{ data: number }>(`/notifications/no-read-count`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  },
  async getNotifications(filter: FilterQuery, token: string) {
    const query = objectToQueryString(filter)
    return fetchHelper<PaginateResponse<NotificationModel>>(`/notifications?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  },
  update(id: string, body: Partial<NotificationModel>, token: string) {
    return fetchHelper<{ data: NotificationModel }>(`/notifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
  },
  deleteOne(id: string, token: string) {
    return fetchHelper(`/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  },
  markAllAsRead(token: string) {
    return fetchHelper(`/notifications/marked-as-read`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  },
}

export default NotificationService

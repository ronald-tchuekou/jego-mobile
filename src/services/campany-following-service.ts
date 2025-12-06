import { fetchHelper } from '../lib/fetch-helper'
import { objectToQueryString } from '../lib/utils'
import { UserModel } from './auth-service'
import { CompanyModel } from './company-service'

export type CompanyFollowingModel = {
  companyId: string
  userId: string
  user: UserModel
  company: CompanyModel
  createdAt: string
  updatedAt: string
}

export type CreateCompanyFollowingDto = {
  companyId: string
}

const CompanyFollowingService = {
  async getUserFollowing(userId: string, companyId: string, token: string) {
    const { data, error } = await fetchHelper<{ data: CompanyFollowingModel }>(
      `/company-following/${companyId}/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (error) throw new Error(error)
    return data?.data || null
  },

  async getUserFollowings(userId: string, filter: FilterQuery, token: string) {
    const query = objectToQueryString(filter)
    const { data, error } = await fetchHelper<PaginateResponse<CompanyFollowingModel>>(
      `/company-following/user/${userId}?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (error) throw new Error(error)
    return data
  },

  async createOne(body: CreateCompanyFollowingDto, token: string) {
    const { data, error } = await fetchHelper<{ data: CompanyFollowingModel }>(`/company-following/${body.companyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    if (!data?.data) throw new Error('Une erreur est survenue lors de la création du following.')
    return data.data
  },

  async deleteOne(companyId: string, token: string) {
    const { data, error } = await fetchHelper<{ message: string }>(`/company-following/${companyId}`, {
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

export default CompanyFollowingService

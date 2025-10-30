import { fetchHelper } from '../lib/fetch-helper'
import { objectToQueryString } from '../lib/utils'
import { UserModel } from './auth-service'
import { JobApplicationModel } from './job-application-service'

export enum JobStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export type JobModel = {
  id: string
  userId: string
  title: string
  description: string
  companyName: string | null
  companyLogo: string | null
  companyWebsite: string | null
  companyEmail: string | null
  companyPhone: string | null
  companyAddress: string | null
  companyCity: string | null
  companyState: string | null
  companyZip: string | null
  companyCountry: string | null
  expiresAt: string | null
  status: JobStatus
  createdAt: string
  updatedAt: string
  user: UserModel
  applications: JobApplicationModel[]
  applicationCount: number
}

const JobService = {
  async count(companyId?: string) {
    const { data, error } = await fetchHelper<{ count: number }>(`/jobs/count?companyId=${companyId || ''}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (error) throw new Error(error)
    return data?.count
  },

  async getAll(filter: FilterQuery & { status?: JobStatus; companyName?: string }) {
    const query = objectToQueryString(filter)

    const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(`/jobs/active?${query}`)
    if (error) throw new Error(error)
    return data
  },

  async getById(id: string) {
    const { data, error } = await fetchHelper<{ data: JobModel }>(`/jobs/${id}`)
    if (error) throw new Error(error)
    return data?.data || null
  },

  async getByUserId(userId: string) {
    const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(`/jobs/user/${userId}`)
    if (error) throw new Error(error)
    return data
  },

  async getExpired() {
    const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(`/jobs/expired`)
    if (error) throw new Error(error)
    return data
  },

  async getActive() {
    const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(`/jobs/active`)
    if (error) throw new Error(error)
    return data
  },

  async getStats() {
    const { data, error } = await fetchHelper<{
      data: {
        total: number
        open: number
        closed: number
        expired: number
        active: number
        withCompany: number
        withoutCompany: number
      }
    }>(`/jobs/stats`)
    if (error) throw new Error(error)
    return data?.data
  },
}

export default JobService

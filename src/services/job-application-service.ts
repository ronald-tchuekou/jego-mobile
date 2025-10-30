import { fetchHelper } from '../lib/fetch-helper'
import { objectToQueryString } from '../lib/utils'
import { UserModel } from './auth-service'
import { JobModel } from './job-service'

export enum JobApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export type JobApplicationModel = {
  id: string
  jobId: string
  userId: string
  status: JobApplicationStatus
  resumePath: string
  createdAt: string
  updatedAt: string
  job: JobModel
  user: UserModel
}

/*
router.get(':id', [JobApplicationsController, 'show'])
 */

const JobApplicationService = {
  async getAll(filter: FilterQuery & { status?: JobApplicationStatus }, token: string) {
    const query = objectToQueryString(filter)
    const companyId = filter.companyId
    const withoutCompanyId = companyId ? `/company/${companyId}` : ''

    const { data, error } = await fetchHelper<PaginateResponse<JobApplicationModel>>(
      `/job-applications${withoutCompanyId}?${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (error) throw new Error(error)

    return data
  },

  async create(body: Partial<JobApplicationModel>, token: string) {
    const { data, error } = await fetchHelper<JobApplicationModel>('/job-applications', {
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

  async update(id: string, body: Partial<JobApplicationModel>, token: string) {
    const { data, error } = await fetchHelper<JobApplicationModel>(`/job-applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (error) throw new Error(error)
    return data
  },

  async delete(id: string, token: string) {
    const { data, error } = await fetchHelper<JobApplicationModel>(`/job-applications/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (error) throw new Error(error)
    return data
  },

  async getById(id: string, token: string) {
    const { data, error } = await fetchHelper<{ data: JobApplicationModel }>(`/job-applications/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (error) throw new Error(error)

    return data?.data
  },

  async getByCompanyId(companyId: string, filter: FilterQuery, token: string) {
    const query = objectToQueryString(filter)
    const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(
      `/job-applications/company/${companyId}?${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (error) throw new Error(error)
    return data
  },

  async getByUserId(userId: string, filter: FilterQuery, token: string) {
    const query = objectToQueryString(filter)
    const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(`/job-applications/user/${userId}?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async getByJobId(jobId: string, filter: FilterQuery, token: string) {
    const query = objectToQueryString(filter)
    const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(`/job-applications/job/${jobId}?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async getTotal(filter: FilterQuery, token: string) {
    const query = objectToQueryString(filter)
    const { data, error } = await fetchHelper<{ count: number }>(`/job-applications/count?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async getApplicationsCountPerDay(token: string, range?: { startDate: string; endDate: string }) {
    let query = ''
    if (range) {
      query = objectToQueryString(range)
    }
    const { data, error } = await fetchHelper<{
      data: { date: string; count: number }[]
      startDate: string
      endDate: string
    }>(`/job-applications/count-per-day?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async getStatistics(token: string) {
    const { data, error } = await fetchHelper<{
      total: number
      pending: number
      accepted: number
      rejected: number
      averagePerJob: number
      averagePerUser: number
    }>(`/job-applications/stats`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async getRecent(filter: FilterQuery, token: string) {
    const query = objectToQueryString(filter)
    const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(`/job-applications/recent?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async getUserStatistics(userId: string, filter: FilterQuery, token: string) {
    const query = objectToQueryString(filter)
    const { data, error } = await fetchHelper<PaginateResponse<JobModel>>(
      `/job-applications/user/${userId}/stats?${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (error) throw new Error(error)
    return data
  },

  async getJobStatistics(jobId: string, token: string) {
    const { data, error } = await fetchHelper<{
      total: number
      pending: number
      accepted: number
      rejected: number
    }>(`/job-applications/job/${jobId}/stats`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },

  async hasApplied(userId: string, jobId: string, token: string) {
    const { data, error } = await fetchHelper<{
      hasApplied: boolean
      application: JobApplicationModel | null
    }>(`/job-applications/job/${jobId}/check?userId=${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (error) throw new Error(error)
    return data
  },
}

export default JobApplicationService

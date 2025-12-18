import { jobKey } from '@/src/lib/query-kye'
import JobService, { JobStatus } from '@/src/services/job-service'
import { QueryFilters, useQuery } from '@tanstack/react-query'

type Options = {
  filter: QueryFilters & { companyName?: string }
}

export default function useGetJobs(options?: Options) {
  const { filter = {} } = options || {}

  // React Query for data fetching
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: jobKey.list(filter),
    async queryFn({ queryKey }) {
      const filters = JSON.parse(queryKey[2].filters)
      return JobService.getAll({
        ...filters,
        status: JobStatus.OPEN,
      })
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    jobs: data?.data || [],
    isLoading,
    isRefetching,
    refetch,
    totalCount: data?.meta.total || 0,
    totalPages: data?.meta.lastPage || 1,
  }
}

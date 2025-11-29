import { jobKey } from '@/src/lib/query-kye'
import JobService from '@/src/services/job-service'
import { useQuery } from '@tanstack/react-query'

export default function useGetJob(jobId: string) {
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: jobKey.detail(jobId),
    async queryFn({ queryKey }) {
      const jobId = queryKey[2]
      return JobService.getById(jobId)
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return { job: data || null, isLoading, isRefetching, refetch }
}

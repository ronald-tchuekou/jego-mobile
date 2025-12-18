import { applicationKey } from '@/src/lib/query-kye'
import JobApplicationService, { type JobApplicationModel } from '@/src/services/job-application-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useQuery } from '@tanstack/react-query'

type Options = {
  filters?: Partial<{
    page: number
    limit: number
    status: string
  }>
}

export default function useGetJobApplications(options?: Options) {
  const { filters } = options || {}
  const auth = useAuthStore((s) => s.auth)

  const token = auth?.token
  const userId = auth?.user?.id

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: applicationKey.list({
      userId,
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 30,
      status: filters?.status,
    }),
    async queryFn({ queryKey }) {
      const parsed = JSON.parse(queryKey[2].filters)
      if (!token || !userId) throw new Error('Token manquant')
      const result = await JobApplicationService.getByUserId(
        userId,
        {
          page: parsed.page,
          limit: parsed.limit,
          status: parsed.status,
        },
        token,
      )
      return result
    },
    enabled: !!token && !!userId,
    staleTime: 5 * 60 * 1000,
  })

  return {
    applications: (data?.data as JobApplicationModel[]) || [],
    isLoading,
    isRefetching,
    refetch,
    meta: data?.meta,
  }
}

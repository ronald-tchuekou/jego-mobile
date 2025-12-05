import { appointKey } from '@/src/lib/query-kye'
import CompanyAppointmentRequestService, {
    type CompanyAppointmentRequestModel,
} from '@/src/services/company-appointment-request-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useQuery } from '@tanstack/react-query'

type Options = {
  filters?: Partial<{
    page: number
    limit: number
    search: string
    status: string
  }>
}

export default function useGetAppointments(options?: Options) {
  const { filters } = options || {}
  const auth = useAuthStore((s) => s.auth)

  const token = auth?.token
  const userId = auth?.user?.id

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: appointKey.list({
      userId,
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 30,
      search: filters?.search,
      status: filters?.status,
    }),
    async queryFn({ queryKey }) {
      const parsed = JSON.parse(queryKey[2].filters)
      if (!token || !userId) throw new Error('Token manquant')
      const result = await CompanyAppointmentRequestService.getAll(
        {
          page: parsed.page,
          limit: parsed.limit,
          search: parsed.search,
          status: parsed.status,
          userId,
        },
        token,
      )
      return result
    },
    enabled: !!token && !!userId,
    staleTime: 5 * 60 * 1000,
  })

  return {
    appointments: (data?.data as CompanyAppointmentRequestModel[]) || [],
    isLoading,
    isRefetching,
    refetch,
    meta: data?.meta,
  }
}


import { appointKey } from '@/src/lib/query-kye'
import CompanyAppointmentRequestService, {
  type CompanyAppointmentRequestModel,
} from '@/src/services/company-appointment-request-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useQuery } from '@tanstack/react-query'

export default function useGetAppointment(id?: string) {
  const auth = useAuthStore((s) => s.auth)
  const token = auth?.token

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: appointKey.detail(id || ''),
    async queryFn() {
      if (!id) throw new Error('ID manquant')
      if (!token) throw new Error('Token manquant')
      return CompanyAppointmentRequestService.getById(id, token)
    },
    enabled: !!id && !!token,
    staleTime: 5 * 60 * 1000,
  })

  return {
    appointment: data as CompanyAppointmentRequestModel | null,
    isLoading,
    isRefetching,
    refetch,
  }
}

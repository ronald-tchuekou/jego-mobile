import { companyKey } from '@/src/lib/query-kye'
import CompanyService from '@/src/services/company-service'
import { useQuery } from '@tanstack/react-query'

type Options = {
  filters?: FilterQuery & {
    categoryId?: string
  }
}

export default function useGetCompanies(options?: Options) {
  const { filters } = options || {}

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: companyKey.list({
      ...(filters || {}),
    }),
    async queryFn({ queryKey }) {
      const { search, categoryId } = JSON.parse(queryKey[2].filters)

      const filters: FilterQuery & {
        categoryId?: string
        status?: 'active' | 'blocked'
      } = { limit: 30, status: 'active' }

      if (search) filters.search = search

      if (categoryId && categoryId !== 'all') {
        filters.categoryId = categoryId
      }

      return CompanyService.getAll(filters)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return { companies: data?.data || [], isLoading, isRefetching, refetch }
}

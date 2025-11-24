import { companyKey } from '@/src/lib/query-kye'
import CompanyService from '@/src/services/company-service'
import { useCompaniesViewStore } from '@/src/stores/companies-view-store'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

export default function useGetCompanies({
  categoryId,
  page,
  search,
}: {
  categoryId?: string
  page?: number
  search?: string
}) {
  const { setCompanies, setLoadingCompanies, addNewCompanies } = useCompaniesViewStore(
    useShallow((state) => ({
      setCompanies: state.setCompanies,
      setLoadingCompanies: state.setLoadingCompanies,
      addNewCompanies: state.addNewCompanies,
    })),
  )

  const { data, isLoading, refetch } = useQuery({
    queryKey: companyKey.list({
      page,
      search,
      categoryId,
    }),
    async queryFn({ queryKey }) {
      const { page = 1, search, categoryId } = JSON.parse(queryKey[2].filters)

      const filters: FilterQuery & {
        categoryId?: string
        status?: 'active' | 'blocked'
      } = { page, limit: 30, status: 'active' }

      if (search) filters.search = search

      if (categoryId && categoryId !== 'all') {
        filters.categoryId = categoryId
      }

      return CompanyService.getAll(filters)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const { mutate, isPending } = useMutation({
    async mutationFn({ page, search }: { page: number; search?: string }) {
      const response = await CompanyService.getAll({ page, search })
      addNewCompanies(response?.data || [], response?.meta.currentPage || 1, response?.meta.lastPage || 1)
    },
  })

  useEffect(() => {
    setCompanies(data?.data || [], data?.meta.currentPage || 1, data?.meta.lastPage || 1)
  }, [data, setCompanies])

  useEffect(() => {
    setLoadingCompanies(isLoading)
  }, [isLoading, setLoadingCompanies])

  return { mutate, isPending, refetch }
}

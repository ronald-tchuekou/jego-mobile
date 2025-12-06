import { followingKey } from '@/src/lib/query-kye'
import CompanyFollowingService, { type CompanyFollowingModel } from '@/src/services/campany-following-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useQuery } from '@tanstack/react-query'

type Options = {
  filters?: Partial<{
    page: number
    limit: number
  }>
}

export default function useGetUserFollowings(options?: Options) {
  const { filters } = options || {}
  const auth = useAuthStore((s) => s.auth)

  const token = auth?.token
  const userId = auth?.user?.id

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: followingKey.list({
      userId,
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 30,
    }),
    async queryFn({ queryKey }) {
      const parsed = JSON.parse(queryKey[2].filters)
      if (!token || !userId) throw new Error('Token manquant')
      const result = await CompanyFollowingService.getUserFollowings(
        userId,
        {
          page: parsed.page,
          limit: parsed.limit,
        },
        token,
      )
      return result
    },
    enabled: !!token && !!userId,
    staleTime: 5 * 60 * 1000,
  })

  return {
    followings: (data?.data as CompanyFollowingModel[]) || [],
    isLoading,
    isRefetching,
    refetch,
    meta: data?.meta,
  }
}


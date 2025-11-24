import EmptyContent from '@/src/components/base/empty-content'
import { Center } from '@/src/components/ui/center'
import { Spinner } from '@/src/components/ui/spinner'
import { VStack } from '@/src/components/ui/vstack'
import PostItem from '@/src/features/posts/components/post-item'
import { postKey } from '@/src/lib/query-kye'
import { CompanyModel } from '@/src/services/company-service'
import PostService from '@/src/services/post-service'
import { useQuery } from '@tanstack/react-query'
import { memo } from 'react'
import { Text } from 'react-native'

type Props = {
  company: CompanyModel
}

const CompanyPosts = ({ company }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: postKey.list({
      companyId: company.id,
    }),
    async queryFn({ queryKey }) {
      const { search, companyId } = JSON.parse(queryKey[2].filters)
      const filters: FilterQuery = { limit: 30 }

      if (search) filters.search = search
      if (companyId) filters.companyId = companyId

      return PostService.getAll(filters)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const posts = data?.data || []

  return (
    <>
      <Text className={'text-xl font-semibold mb-3'}>Annonces postées</Text>
      {isLoading ? (
        <Center className='p-6'>
          <Spinner size={'large'} className='text-jego-primary' />
        </Center>
      ) : !posts || posts.length === 0 ? (
        <EmptyContent text={'Aucune post disponible pour cette entreprise.'} />
      ) : (
        <VStack space='md'>
          {posts.map((post) => (
            <PostItem key={post.id} item={post} showDetails={false} />
          ))}
        </VStack>
      )}
    </>
  )
}

export default memo(CompanyPosts)

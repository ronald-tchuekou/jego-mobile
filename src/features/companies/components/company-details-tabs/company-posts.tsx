import EmptyContent from '@/src/components/base/empty-content'
import { Center } from '@/src/components/ui/center'
import { Spinner } from '@/src/components/ui/spinner'
import { VStack } from '@/src/components/ui/vstack'
import PostItem from '@/src/features/posts/components/post-item'
import useGetPosts from '@/src/features/posts/hooks/use-get-posts'
import { CompanyModel } from '@/src/services/company-service'
import { memo } from 'react'
import { Text } from 'react-native'

type Props = {
  company: CompanyModel
}

const CompanyPosts = ({ company }: Props) => {
  const { posts, isLoading } = useGetPosts({ filters: { companyId: company.id }, queryKeyLabel: 'company-posts' })

  return (
    <>
      <Text className={'text-xl font-semibold text-jego-foreground mb-3'}>Annonces postées</Text>
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

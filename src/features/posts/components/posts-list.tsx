import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { FlatList, RefreshControl } from 'react-native'
import useGetPosts from '../hooks/use-get-posts'
import PostItem from './post-item'

type Props = { search?: string }

function PostsList({ search }: Props) {
  const { posts, isLoading, isRefetching, refetch } = useGetPosts({ queryKeyLabel: 'posts-list', filters: { search } })

  return (
    <FlatList
      className='flex-1'
      contentContainerClassName='p-4 gap-4'
      data={posts}
      refreshing={isRefetching}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      ListEmptyComponent={isLoading ? <LoaderContent /> : <EmptyContent text={'Aucun contenu pour le moment.'} />}
      renderItem={({ item }) => <PostItem item={item} />}
      keyExtractor={(item, index) => `${item.id}-${index}`}
    />
  )
}

export default PostsList

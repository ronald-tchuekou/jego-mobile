'use client'

import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { Center } from '@/src/components/ui/center'
import { Spinner } from '@/src/components/ui/spinner'
import { usePostsStore } from '@/src/stores/posts-store'
import { FlatList, RefreshControl, View } from 'react-native'
import { useShallow } from 'zustand/shallow'
import useGetPosts from '../hooks/use-get-posts'
import PostItem from './post-item'

type Props = { search?: string }

function PostsList({ search }: Props) {
  const { posts, isLoading, page, totalPage } = usePostsStore(
    useShallow((s) => ({
      posts: s.posts,
      isLoading: s.isLoading,
      page: s.page,
      totalPage: s.totalPage,
    })),
  )
  const { mutate, isPending, refetch } = useGetPosts({ search, queryKeyLabel: 'posts-list' })

  return (
    <FlatList
      className='flex-1'
      contentContainerClassName='p-4 gap-4'
      data={posts}
      refreshing={isLoading || isPending}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (page < totalPage) mutate({ page: page + 1, search: search || undefined })
      }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      ListEmptyComponent={isLoading && posts.length === 0 ? <LoaderContent /> : <EmptyContent text={'Aucun contenu pour le moment.'} />}
      ListFooterComponent={
        isPending ? (
          <Center className='py-4'>
            <Spinner />
          </Center>
        ) : (
          <View className='h-5' />
        )
      }
      renderItem={({ item }) => <PostItem item={item} />}
      keyExtractor={(item, index) => `${item.id}-${index}`}
    />
  )
}

export default PostsList

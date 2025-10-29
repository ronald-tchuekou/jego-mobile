"use client";

import { Center } from "@/src/components/ui/center";
import { Spinner } from "@/src/components/ui/spinner";
import { VStack } from "@/src/components/ui/vstack";
import { usePostsStore } from "@/src/stores/posts-store";
import { CircleSlash2Icon } from 'lucide-react-native'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import { useShallow } from "zustand/shallow";
import useGetPosts from "../hooks/use-get-posts";
import PostItem from "./post-item";

type Props = { search?: string };

function PostsList({ search }: Props) {
  const { posts, isLoading, page, totalPage } = usePostsStore(
    useShallow((s) => ({
      posts: s.posts,
      isLoading: s.isLoading,
      page: s.page,
      totalPage: s.totalPage,
    })),
  );
  const { mutate, isPending, refetch } = useGetPosts(search);

  return (
		<FlatList
			className='flex-1'
			contentContainerClassName='p-4 gap-4'
			data={posts}
			onEndReachedThreshold={0.5}
			onEndReached={() => {
				if (page < totalPage) mutate({ page: page + 1, search: search || undefined })
			}}
			refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
			ListEmptyComponent={
				isLoading ? undefined : (
					<Center className='w-full min-h-80'>
						<VStack className='p-3 items-center' space='md'>
							<CircleSlash2Icon size={40} color={'#666666'} />
							<Text className='text-base text-jego-muted-foreground'>Aucun contenu pour le moment.</Text>
						</VStack>
					</Center>
				)
			}
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
			keyExtractor={(item) => item.id}
		/>
  )
}

export default PostsList;

import { BackButton } from '@/src/components/base/back-button'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Button, ButtonIcon, ButtonText } from '@/src/components/ui/button'
import { Center } from '@/src/components/ui/center'
import { HStack } from '@/src/components/ui/hstack'
import { Spinner } from '@/src/components/ui/spinner'
import { VStack } from '@/src/components/ui/vstack'
import { LikePostButton } from '@/src/features/posts/components/like-post-button'
import { SharePostButton } from '@/src/features/posts/components/share-post-button'
import { env } from '@/src/lib/env'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { IMAGES } from '@/src/lib/images'
import { postKey } from '@/src/lib/query-kye'
import { compactNumber, formatDate } from '@/src/lib/utils'
import PostService, { PostModel } from '@/src/services/post-service'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { CircleSlash2Icon, MessageCircleMoreIcon } from 'lucide-react-native'
import { ScrollView, Text, View } from 'react-native'
import { cnBase } from 'tailwind-variants'
import CommentWrapper from '@/src/features/post-comments/components/comment-wrapper'
import { CommentInput } from '@/src/features/post-comments/components/comment-input'
import { PostImages } from '@/src/features/posts/components/post-images'

export default function PostDetailsScreen() {
  const { post_id } = useLocalSearchParams<{ post_id: string }>()

  const height = getStatusBarHeight()

  const { data, isLoading } = useQuery({
    queryKey: postKey.detail(post_id),
    async queryFn({ queryKey }) {
      const postId = queryKey[2]
      return PostService.getById(postId)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const company = data?.user?.company
  const companyLogo = company?.logo ? { uri: `${env.API_URL}/v1/${company?.logo}` } : IMAGES.default_company_logo

  return (
    <VStack className='flex-1 bg-jego-background'>
      <HStack space='md' className='p-4 bg-jego-card border-b border-jego-border' style={{ paddingTop: height + 10 }}>
        <BackButton />
        <Avatar size='md'>
          <AvatarImage source={companyLogo} />
        </Avatar>
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-jego-foreground' numberOfLines={1}>
            {company?.name || '- - -'}
          </Text>
          <Text className='text-sm text-typography-600'>{data?.createdAt ? formatDate(data.createdAt) : '- - -'}</Text>
        </VStack>
      </HStack>
      <ScrollView className='flex-1'>
        {isLoading ? (
          <Center className='min-h-32'>
            <Spinner size={'large'} />
          </Center>
        ) : !data ? (
          <Center className='w-full min-h-80'>
            <VStack className='p-3 items-center' space='md'>
              <CircleSlash2Icon size={40} color={'#666666'} />
              <Text className='text-base text-jego-muted-foreground'>Annonce non trouvé.</Text>
            </VStack>
          </Center>
        ) : (
          <Content post={data} />
        )}
      </ScrollView>
      {data && <CommentInput post={data} />}
    </VStack>
  )
}

const Content = ({ post }: { post: PostModel }) => {
  const medias = post.medias
  const mediaType = post.mediaType

  return (
    <>
      <View className={'h-3'} />
      <Text className='text-base text-jego-muted-foreground px-4 pb-2'>{post.description}</Text>
      {mediaType === 'image' ? <PostImages medias={medias} /> : <View className='h-3' />}
      <HStack className='justify-between px-1'>
        <LikePostButton post={post} />
        <Button size='lg' variant='link' className='px-4'>
          <ButtonIcon as={MessageCircleMoreIcon} className={cnBase('stroke-jego-muted-foreground')} />
          <ButtonText size='sm' className='text-jego-muted-foreground'>
            {compactNumber(post.commentCount)}
          </ButtonText>
        </Button>
        <SharePostButton post={post} />
      </HStack>
      <CommentWrapper post={post} />
      <View className='h-20' />
    </>
  )
}

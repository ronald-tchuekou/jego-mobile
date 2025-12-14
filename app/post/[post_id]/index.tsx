import { BackButton } from '@/src/components/base/back-button'
import EmptyContent from '@/src/components/base/empty-content'
import { ExpandableText } from '@/src/components/base/expandable-text'
import { HeaderContainer } from '@/src/components/base/header-container'
import { LoaderContent } from '@/src/components/base/loader-content'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Button, ButtonIcon, ButtonText } from '@/src/components/ui/button'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import { CommentInput } from '@/src/features/post-comments/components/comment-input'
import CommentWrapper from '@/src/features/post-comments/components/comment-wrapper'
import { LikePostButton } from '@/src/features/posts/components/like-post-button'
import { PostImages } from '@/src/features/posts/components/post-images'
import { PostVideo } from '@/src/features/posts/components/post-video'
import { SharePostButton } from '@/src/features/posts/components/share-post-button'
import useGetPostById from '@/src/features/posts/hooks/use-get-post-by-id'
import { compactNumber, formatDate, getCompanyLogoUri, getUserProfileImageUri } from '@/src/lib/utils'
import { PostModel } from '@/src/services/post-service'
import { useLocalSearchParams } from 'expo-router'
import { MessageCircleMoreIcon } from 'lucide-react-native'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { cnBase } from 'tailwind-variants'

export default function PostDetailsScreen() {
  const { post_id } = useLocalSearchParams<{ post_id: string }>()
  const { data, isLoading } = useGetPostById(post_id)

  const company = data?.user?.company
  const companyLogo = getCompanyLogoUri(company?.logo)
  const profileSrc = getUserProfileImageUri(data?.user?.profileImage)

  return (
    <SafeAreaView className='bg-card' style={{ flex: 1 }}>
      <HeaderContainer withTopInset={false}>
        <HStack space='md'>
          <BackButton />
          <Avatar size='md'>
            <AvatarImage source={company ? companyLogo : profileSrc} />
          </Avatar>
          <VStack className='flex-1'>
            <Text className='font-semibold text-base text-foreground' numberOfLines={1}>
              {company?.name || data?.user?.displayName || '- - -'}
            </Text>
            <Text className='text-sm text-muted-foreground'>
              {data?.createdAt ? formatDate(data.createdAt) : '- - -'}
            </Text>
          </VStack>
        </HStack>
      </HeaderContainer>

      <ScrollView className='bg-background' contentContainerClassName={'bg-background'} style={{ flex: 1 }}>
        {isLoading ? (
          <LoaderContent />
        ) : !data ? (
          <EmptyContent text="Cette annonce n'existe pas." />
        ) : (
          <Content post={data} />
        )}
      </ScrollView>
      {data && <CommentInput post={data} />}
    </SafeAreaView>
  )
}

const Content = ({ post }: { post: PostModel }) => {
  const medias = post.medias
  const mediaType = post.mediaType

  return (
    <>
      <View className={'h-3'} />
      <ExpandableText text={post.description} className='px-4 pb-2' reduce={false} />
      {mediaType === 'image' && medias.length > 0 && (
        <PostImages medias={medias} author={post.user.company?.name || post.user.displayName} />
      )}
      {mediaType === 'video' && medias.length > 0 && medias[0] && <PostVideo video={medias[0]} post_id={post.id} />}
      <HStack className='justify-between px-1'>
        <LikePostButton post={post} />
        <Button size='lg' variant='link' className='px-4'>
          <ButtonText size='lg' className='text-muted-foreground'>
            {compactNumber(post.commentCount)}
          </ButtonText>
          <ButtonIcon as={MessageCircleMoreIcon} className={cnBase('stroke-muted-foreground')} />
        </Button>
        <SharePostButton post={post} />
      </HStack>
      <CommentWrapper post={post} />
      <View className='h-20' />
    </>
  )
}

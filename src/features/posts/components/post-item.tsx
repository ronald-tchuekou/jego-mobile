import { ExpandableText } from '@/src/components/base/expandable-text'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Button, ButtonIcon, ButtonText } from '@/src/components/ui/button'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import { PostImages } from '@/src/features/posts/components/post-images'
import { PostVideo } from '@/src/features/posts/components/post-video'
import { compactNumber, formatDate, getCompanyLogoUri, getUserProfileImageUri } from '@/src/lib/utils'
import { PostModel } from '@/src/services/post-service'
import { Link } from 'expo-router'
import { MessageCircleMoreIcon } from 'lucide-react-native'
import { Text } from 'react-native'
import { cnBase } from 'tailwind-variants'
import { LikePostButton } from './like-post-button'
import { SharePostButton } from './share-post-button'

export default function PostItem({ item, showDetails = true }: { item: PostModel; showDetails?: boolean }) {
  const company = item.user?.company
  const companyLogo = getCompanyLogoUri(company?.logo)
  const medias = item.medias
  const mediaType = item.mediaType

  // Get user profile image if no company logo
  const profileSrc = getUserProfileImageUri(item.user?.profileImage)

  return (
    <Card className='p-0'>
      <Link href={`/company/${company?.id}`} disabled={!showDetails}>
        <HStack space='md' className='p-4'>
          <Avatar size='md'>
            <AvatarImage source={company ? companyLogo : profileSrc} />
          </Avatar>
          <VStack className='flex-1'>
            <Text className='font-semibold text-base text-card-foreground'>
              {company?.name || item.user?.displayName}
            </Text>
            <Text className='text-sm text-muted-foreground'>{formatDate(item.createdAt)}</Text>
          </VStack>
        </HStack>
      </Link>
      <ExpandableText text={item.description} className='px-4 pb-2' postId={item.id} />
      {mediaType === 'image' && medias.length > 0 && (
        <PostImages medias={medias} author={item.user.company?.name || item.user.displayName} />
      )}
      {mediaType === 'video' && medias.length > 0 && medias[0] && <PostVideo video={medias[0]} post_id={item.id} />}
      <HStack className='justify-between px-1 pb-1'>
        <LikePostButton post={item} />
        <Link href={`/post/${item.id}?focus_comment=true`} asChild>
          <Button size='lg' variant='link' className='px-4'>
            <ButtonText size='lg' className='text-muted-foreground'>
              {compactNumber(item.commentCount)}
            </ButtonText>
            <ButtonIcon as={MessageCircleMoreIcon} className={cnBase('stroke-muted-foreground')} />
          </Button>
        </Link>
        <SharePostButton post={item} />
      </HStack>
    </Card>
  )
}

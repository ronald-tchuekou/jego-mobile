import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Button, ButtonIcon, ButtonText } from '@/src/components/ui/button'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import { PostImages } from '@/src/features/posts/components/post-images'
import { PostVideo } from '@/src/features/posts/components/post-video'
import { env } from '@/src/lib/env'
import { IMAGES } from '@/src/lib/images'
import { compactNumber, formatDate } from '@/src/lib/utils'
import { PostModel } from '@/src/services/post-service'
import { Link, useRouter } from 'expo-router'
import { MessageCircleMoreIcon } from 'lucide-react-native'
import { Text } from 'react-native'
import { cnBase } from 'tailwind-variants'
import { LikePostButton } from './like-post-button'
import { SharePostButton } from './share-post-button'

export default function PostItem({ item }: { item: PostModel }) {
  const router = useRouter()

  const company = item.user?.company
  const companyLogo = company?.logo ? { uri: `${env.API_URL}/v1/${company?.logo}` } : IMAGES.default_company_logo
  const medias = item.medias
  const mediaType = item.mediaType

  const handleDescriptionPress = () =>
    router.push({
      pathname: '/posts/[post_id]',
      params: {
        post_id: item.id,
      },
    })

  return (
    <Card className='rounded-lg p-0'>
      <HStack space='md' className='p-4'>
        <Avatar size='md'>
          <AvatarImage source={companyLogo} />
        </Avatar>
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-jego-foreground'>{company?.name}</Text>
          <Text className='text-sm text-typography-600'>{formatDate(item.createdAt)}</Text>
        </VStack>
      </HStack>
      <Text onPress={handleDescriptionPress} className='text-sm text-jego-muted-foreground px-4 pb-2' numberOfLines={3}>
        {item.description}
      </Text>
      {mediaType === 'image' && <PostImages medias={medias} />}
      {mediaType === 'video' && medias.length > 0 && <PostVideo video={medias[0]} post_id={item.id} />}
      <HStack className='justify-between px-1 pb-1'>
        <LikePostButton post={item} />
        <Link href={`/posts/${item.id}?focus_comment=true`} asChild>
          <Button size='lg' variant='link' className='px-4'>
            <ButtonIcon as={MessageCircleMoreIcon} className={cnBase('stroke-jego-muted-foreground')} />
            <ButtonText size='sm' className='text-jego-muted-foreground'>
              {compactNumber(item.commentCount)}
            </ButtonText>
          </Button>
        </Link>
        <SharePostButton post={item} />
      </HStack>
    </Card>
  )
}

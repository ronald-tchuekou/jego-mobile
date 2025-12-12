import { BackButton } from '@/src/components/base/back-button'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Button, ButtonIcon, ButtonText } from '@/src/components/ui/button'
import { Center } from '@/src/components/ui/center'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import VideoPlayer from '@/src/components/video/vodeo-player'
import { LikePostButton } from '@/src/features/posts/components/like-post-button'
import { SharePostButton } from '@/src/features/posts/components/share-post-button'
import useGetPostById from '@/src/features/posts/hooks/use-get-post-by-id'
import { compactNumber, formatDate, getCompanyLogoUri, getUserProfileImageUri, getVideoUri } from '@/src/lib/utils'
import { useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ArrowLeftIcon, MessageCircleMoreIcon } from 'lucide-react-native'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { cnBase } from 'tailwind-variants'
import { LoaderContent } from '@/src/components/base/loader-content'

export default function PostVideoPlayerScreen1() {
  // Params
  const { post_id } = useLocalSearchParams<{ post_id: string }>()

  // Queries
  const { data, isLoading: isLoadingPost } = useGetPostById(post_id)

  // Get the company info
  const company = data?.user?.company
  const companyLogo = getCompanyLogoUri(company?.logo)

  // Get the user info
  const username = data?.user?.displayName
  const userAvatar = getUserProfileImageUri(data?.user?.profileImage)

  const video = data?.medias[0]
  const sourceUri = !video ? undefined : getVideoUri(video.url)
  const avatar = !company ? userAvatar : companyLogo

  return (
    <SafeAreaView style={{ flex: 1 }} className='bg-black'>
      <StatusBar style='light' />
      {/* Header */}
      <HStack space='md' className='px-4 py-2 bg-transparent'>
        <BackButton iconClassName='text-gray-400' />
        <Avatar size='md'>
          <AvatarImage source={avatar as any} />
        </Avatar>
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-gray-300' numberOfLines={1}>
            {company?.name || username || '- - -'}
          </Text>
          <Text className='text-sm text-gray-500'>{data?.createdAt ? formatDate(data.createdAt) : '- - -'}</Text>
        </VStack>
      </HStack>

      {/* Loader */}
      {isLoadingPost ? (
        <Center className='flex-1'>
          <LoaderContent />
        </Center>
      ) : !data ? (
        <VStack className='p-20 items-center justify-center gap-5'>
          <Text className='text-base text-white/70'>Oops! Aucune vidéo trouvée.</Text>
          <Text className='text-sm text-white/70'>{"La vidéo que vous cherchez n'existe pas ou a été supprimée."}</Text>
          <Button size='lg' variant='link' className='px-4'>
            <ButtonIcon as={ArrowLeftIcon} size={'xl'} className={cnBase('stroke-jego-muted-foreground')} />
            <ButtonText size='sm' className='text-jego-muted-foreground'>
              Retour
            </ButtonText>
          </Button>
        </VStack>
      ) : (
        <>
          {/* Video player */}
          {sourceUri && <VideoPlayer sourceUri={sourceUri} />}

          {/* Action buttons */}
          <VStack space={'md'} className='absolute bottom-32 right-2 px-1 py-3 bg-black/30 rounded-full'>
            <LikePostButton post={data} orientation={'vertical'} />
            <Button size='lg' style={{ height: 50 }} variant='link' className='p-4 flex-col items-center gap-0'>
              <ButtonIcon as={MessageCircleMoreIcon} className={cnBase('stroke-white')} />
              <ButtonText size='lg' className='text-white'>
                {compactNumber(data.commentCount)}
              </ButtonText>
            </Button>
            <SharePostButton post={data} orientation={'vertical'} />
          </VStack>
        </>
      )}
    </SafeAreaView>
  )
}

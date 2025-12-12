import { BackButton } from '@/src/components/base/back-button'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Button, ButtonIcon, ButtonText } from '@/src/components/ui/button'
import { Center } from '@/src/components/ui/center'
import { HStack } from '@/src/components/ui/hstack'
import { Spinner } from '@/src/components/ui/spinner'
import { VStack } from '@/src/components/ui/vstack'
import VideoPlayer from '@/src/components/video/vodeo-player'
import { LikePostButton } from '@/src/features/posts/components/like-post-button'
import { SharePostButton } from '@/src/features/posts/components/share-post-button'
import useGetPostById from '@/src/features/posts/hooks/use-get-post-by-id'
import { env } from '@/src/lib/env'
import { IMAGES } from '@/src/lib/images'
import { compactNumber, formatDate } from '@/src/lib/utils'
import { useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ArrowLeftIcon, MessageCircleMoreIcon } from 'lucide-react-native'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { cnBase } from 'tailwind-variants'

export default function PostVideoPlayerScreen1() {
  // Params
  const { post_id } = useLocalSearchParams<{ post_id: string }>()

  // Queries
  const { data, isLoading: isLoadingPost } = useGetPostById(post_id)

  // Render
  const company = data?.user?.company
  const companyLogo = company?.logo ? { uri: `${env.API_URL}/v1/${company?.logo}` } : IMAGES.default_company_logo
  const video = data?.medias[0]
  const sourceUri = !video ? undefined : video.url.startsWith('http') ? video.url : `${env.API_URL}/v1/${video.url}`

  return (
    <SafeAreaView className='bg-black flex-1'>
      <StatusBar style='light' />
      <HStack space='md' className='p-4 bg-transparent border-b border-gray-700'>
        <BackButton iconClassName='text-gray-400' />
        <Avatar size='md'>
          <AvatarImage source={companyLogo} />
        </Avatar>
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-gray-300' numberOfLines={1}>
            {company?.name || '- - -'}
          </Text>
          <Text className='text-sm text-gray-500'>{data?.createdAt ? formatDate(data.createdAt) : '- - -'}</Text>
        </VStack>
      </HStack>
      <View className='flex-1 relative'>
        {isLoadingPost ? (
          <Center className='flex-1'>
            <Spinner size='large' className='text-jego-primary' />
          </Center>
        ) : null}
        {sourceUri ? <VideoPlayer sourceUri={sourceUri} /> : null}
        {data ? (
          <View className='w-full absolute bottom-0 left-0 right-0'>
            <View className='p-2'>
              <Text className='text-base text-white/70'>
                <Text>{data.description.slice(0, 100) + '...'}</Text>
                <Text className='font-bold'>Voir plus</Text>
              </Text>
            </View>
          </View>
        ) : (
          <VStack className='p-20 items-center justify-center gap-5'>
            <Text className='text-base text-white/70'>Oops! Aucune vidéo trouvée.</Text>
            <Text className='text-sm text-white/70'>
              {"La vidéo que vous cherchez n'existe pas ou a été supprimée."}
            </Text>
            <Button size='lg' variant='link' className='px-4'>
              <ButtonIcon as={ArrowLeftIcon} size={'xl'} className={cnBase('stroke-jego-muted-foreground')} />
              <ButtonText size='sm' className='text-jego-muted-foreground'>
                Retour
              </ButtonText>
            </Button>
          </VStack>
        )}
      </View>
      {data ? (
        <HStack className='justify-between px-1 bg-black/50'>
          <LikePostButton post={data} />
          <Button size='lg' variant='link' className='px-4'>
            <ButtonIcon as={MessageCircleMoreIcon} className={cnBase('stroke-jego-muted-foreground')} />
            <ButtonText size='sm' className='text-jego-muted-foreground'>
              {compactNumber(data.commentCount)}
            </ButtonText>
          </Button>
          <SharePostButton post={data} />
        </HStack>
      ) : null}
    </SafeAreaView>
  )
}

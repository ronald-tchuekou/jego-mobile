import { Center } from '@/src/components/ui/center'
import { Icon } from '@/src/components/ui/icon'
import { Image } from '@/src/components/ui/image'
import { getVideoUri } from '@/src/lib/utils'
import { MediaModel } from '@/src/services/post-service'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import * as VideoThumbnails from 'expo-video-thumbnails'
import { AlertCircleIcon, PlayIcon } from 'lucide-react-native'
import { Text, TouchableOpacity, View } from 'react-native'
import { cnBase } from 'tailwind-variants'

export type PostVideoProps = {
  video: MediaModel
  post_id: string
}

// A lightweight, Instagram-like video player optimized for feed usage
export function PostVideo({ video, post_id }: PostVideoProps) {
  const router = useRouter()

  // Variables
  const sourceUri = !video ? undefined : getVideoUri(video.url)

  // Queries
  const { data, error } = useQuery({
    queryKey: ['video-thumbnail', sourceUri],
    queryFn: () => {
      if (!sourceUri) throw new Error('Pas de source fourni.')

      return VideoThumbnails.getThumbnailAsync(sourceUri, { time: 1000 })
    },
    enabled: !!sourceUri,
  })

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/post/${post_id}/video?thumbnail=${data?.uri || ''}`)}
      className='relative mb-4 w-full bg-black h-[300px]'
    >
      {sourceUri && data?.uri && !error && (
        <>
          <Image
            source={{ uri: data?.uri }}
            style={video.metadata?.aspectRatio ? { aspectRatio: video.metadata?.aspectRatio } : undefined}
            className={`w-full h-[300px] bg-black ${
              video.metadata?.aspectRatio ? `aspect-${video.metadata.aspectRatio}` : 'aspect-video'
            }`}
            resizeMode='contain'
            alt={video.name || 'Video thumbnail'}
          />
          <View className='absolute inset-0 justify-center items-center bg-black/20'>
            <Center style={{ width: 40, height: 40 }} className='rounded-full bg-primary'>
              <Icon as={PlayIcon} className={cnBase('stroke-primary-foreground fill-primary-foreground')} />
            </Center>
          </View>
        </>
      )}
      {error && (
        <View className='flex-1 flex items-center justify-center gap-3 text-muted-foreground p-16'>
          <Icon as={AlertCircleIcon} size={'lg'} style={{ width: 50, height: 50 }} className='text-muted-foreground' />
          <Text className='text-base text-muted-foreground text-center'>
            Nous avons rencontré un problème lors de la récupération de la vidéo.
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

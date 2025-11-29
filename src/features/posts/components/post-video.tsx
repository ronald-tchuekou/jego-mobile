import { Button, ButtonIcon } from '@/src/components/ui/button'
import { Image } from '@/src/components/ui/image'
import { getVideoUri } from '@/src/lib/utils'
import { MediaModel } from '@/src/services/post-service'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'expo-router'
import * as VideoThumbnails from 'expo-video-thumbnails'
import { AlertCircleIcon, PlayIcon } from 'lucide-react-native'
import { Text, View } from 'react-native'
import { cnBase } from 'tailwind-variants'

export type PostVideoProps = {
  video: MediaModel
  post_id: string
}

// A lightweight, Instagram-like video player optimized for feed usage
export function PostVideo({ video, post_id }: PostVideoProps) {
  // Variables
  const sourceUri = !video
    ? undefined
    : video.url.startsWith('http')
      ? video.url
      : getVideoUri(video.url)

  // Queries
  const { data } = useQuery({
    queryKey: ['video-thumbnail', sourceUri],
    queryFn: () => (sourceUri ? VideoThumbnails.getThumbnailAsync(sourceUri, { time: 1000 }) : null),
    enabled: !!sourceUri,
  })

  return (
    <View className='relative mb-4 w-full bg-black h-[300px]'>
      {sourceUri && data?.uri ? (
        <>
          <Image
            source={data?.uri}
            style={video.metadata?.aspectRatio ? { aspectRatio: video.metadata?.aspectRatio } : undefined}
            className={`w-full h-[300px] bg-black ${
              video.metadata?.aspectRatio ? `aspect-${video.metadata.aspectRatio}` : 'aspect-video'
            }`}
            resizeMode='contain'
            alt={video.name || 'Video thumbnail'}
          />
          <View className='absolute inset-0 justify-center items-center bg-black/20'>
            <Link href={`/post/video/${post_id}`} asChild>
              <Button size='lg' className='size-12 rounded-full'>
                <ButtonIcon as={PlayIcon} className={cnBase('stroke-white fill-white')} />
              </Button>
            </Link>
          </View>
        </>
      ) : (
        <View className='flex-1 flex items-center justify-center gap-3 text-muted-foreground p-16'>
          <AlertCircleIcon size={50} color={'#FFC4C4'} className='text-jego-muted-foreground' />
          <Text className='text-base text-jego-muted-foreground text-center'>
            Nous avons rencontré un problème lors de la récupération de la vidéo.
          </Text>
        </View>
      )}
    </View>
  )
}

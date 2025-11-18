import { Button, ButtonIcon } from '@/src/components/ui/button'
import { env } from '@/src/lib/env'
import { MediaModel } from '@/src/services/post-service'
import { Link } from 'expo-router'
import { AlertCircleIcon, PlayIcon } from 'lucide-react-native'
import { useMemo, useRef } from 'react'
import { Text, View } from 'react-native'
import { Video, VideoRef } from 'react-native-video'
import { cnBase } from 'tailwind-variants'

export type PostVideoProps = {
  video: MediaModel
  post_id: string
}

// A lightweight, Instagram-like video player optimized for feed usage
export function PostVideo({ video, post_id }: PostVideoProps) {
  const videoRef = useRef<VideoRef>(null)

  const sourceUri = useMemo(() => {
    if (!video) return undefined
    return video.url.startsWith('http') ? video.url : `${env.API_URL}/v1/${video.url}`
  }, [video])

  const metadata = useMemo(() => video.metadata, [video])

  return (
    <View className='relative mb-4 w-full bg-black justify-center items-center h-[300px]'>
      {sourceUri ? (
        <>
          <Video
            ref={videoRef}
            controls={false}
            source={require('@/assets/videos/video_test_1.mov')}
            className='flex-1 bg-black border border-jego-input'
            style={{ aspectRatio: (metadata?.height || 9) / (metadata?.width || 6) }}
          />
          <View className='absolute inset-0 justify-center items-center bg-black/50'>
            <Link href={`/posts/video/${post_id}`} asChild>
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

import { BackButton } from '@/src/components/base/back-button'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Button, ButtonIcon, ButtonText } from '@/src/components/ui/button'
import { Center } from '@/src/components/ui/center'
import { HStack } from '@/src/components/ui/hstack'
import { Spinner } from '@/src/components/ui/spinner'
import { VStack } from '@/src/components/ui/vstack'
import { Seeker } from '@/src/components/video/seeker'
import { LikePostButton } from '@/src/features/posts/components/like-post-button'
import { SharePostButton } from '@/src/features/posts/components/share-post-button'
import useGetPostById from '@/src/features/posts/hooks/use-get-post-by-id'
import { env } from '@/src/lib/env'
import { IMAGES } from '@/src/lib/images'
import { compactNumber, formatDate } from '@/src/lib/utils'
import { useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { MessageCircleMoreIcon, PlayIcon } from 'lucide-react-native'
import { useMemo, useRef, useState } from 'react'
import { Dimensions, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import Video, {
  BufferingStrategyType,
  OnAudioFocusChangedData,
  OnBufferData,
  OnLoadData,
  OnProgressData,
  OnVideoAspectRatioData,
  OnVideoErrorData,
  VideoRef,
} from 'react-native-video'
import { cnBase } from 'tailwind-variants'

const { width, height } = Dimensions.get('window')

export default function PostVideoPlayerScreen() {
  const videoRef = useRef<VideoRef>(null)

  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [, setVideoSize] = useState({ videoWidth: 0, videoHeight: 0 })
  const [paused, setPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)

  console.log(JSON.stringify({ duration, currentTime, paused, isLoading, isSeeking }, null, 2))

  const { post_id } = useLocalSearchParams<{ post_id: string }>()

  const { data, isLoading: isLoadingPost } = useGetPostById(post_id)

  const company = useMemo(() => data?.user?.company, [data])
  const companyLogo = useMemo(
    () => (company?.logo ? { uri: `${env.API_URL}/v1/${company?.logo}` } : IMAGES.default_company_logo),
    [company],
  )
  // const video = useMemo(() => data?.medias[0], [data])
  // const sourceUri = useMemo(() => {
  //   if (!video) return undefined
  //   return video.url.startsWith('http') ? video.url : `${env.API_URL}/v1/${video.url}`
  // }, [video])

  const onLoad = (data: OnLoadData) => {
    setDuration(data.duration)
  }

  const onProgress = (data: OnProgressData) => {
    console.log('onProgress', data)
    const isEndOfVideo = data.currentTime >= data.seekableDuration
    console.log('isEndOfVideo', isEndOfVideo)
    if (!isEndOfVideo) setCurrentTime(data.currentTime)
  }

  const onVideoLoadStart = () => {
    console.log('onVideoLoadStart')
    setIsLoading(true)
  }

  const onAspectRatio = (data: OnVideoAspectRatioData) => {
    console.log('onAspectRadio called ' + JSON.stringify(data))
    setVideoSize({ videoWidth: data.width, videoHeight: data.height })
  }

  const onVideoBuffer = (param: OnBufferData) => {
    console.log('onVideoBuffer')
    setIsLoading(param.isBuffering)
  }

  const onReadyForDisplay = () => {
    console.log('onReadyForDisplay')
    setIsLoading(false)
  }

  const onAudioBecomingNoisy = () => {
    console.log('onAudioBecomingNoisy')
    setPaused(true)
  }

  const onAudioFocusChanged = (event: OnAudioFocusChangedData) => {
    console.log('onAudioFocusChanged')
    setPaused(!event.hasAudioFocus)
  }

  const onError = (err: OnVideoErrorData) => {
    console.log('onError:', JSON.stringify(err))
    Toast.show({
      text1: 'Une erreur est survenue',
      text2: JSON.stringify(err),
      type: 'error',
      visibilityTime: 6000
    })
  }

  const _renderLoader =
    isLoading || isLoadingPost
      ? () => (
          <Center className='flex-1'>
            <Spinner size='large' className='text-jego-primary' />
          </Center>
        )
      : undefined

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
        <TouchableOpacity
          style={{
            width: width,
            height: height - 250,
          }}
          onPress={() => setPaused((s) => !s)}
          className='relative'
        >
          <Video
            ref={videoRef}
            showNotificationControls={true}
            source={{
              uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              // require('../../../assets/videos/video_test_1.mov')
            }}
            style={{
              width: width,
              height: height - 250,
            }}
            paused={paused}
            controls={false}
            resizeMode={'contain'}
            onLoad={onLoad}
            onProgress={onProgress}
            progressUpdateInterval={500}
            onError={onError}
            onAudioBecomingNoisy={onAudioBecomingNoisy}
            onAudioFocusChanged={onAudioFocusChanged}
            onLoadStart={onVideoLoadStart}
            onAspectRatio={onAspectRatio}
            onReadyForDisplay={onReadyForDisplay}
            onBuffer={onVideoBuffer}
            repeat={true}
            playInBackground={false}
            preventsDisplaySleepDuringVideoPlayback={true}
            renderLoader={_renderLoader}
            bufferingStrategy={BufferingStrategyType.DEFAULT}
            debug={{ enable: true, thread: true }}
            subtitleStyle={{ subtitlesFollowVideo: true }}
            controlsStyles={{
              hideNavigationBarOnFullScreenMode: true,
              hideNotificationBarOnFullScreenMode: true,
              liveLabel: 'LIVE',
            }}
          />
          {paused && (
            <View className='absolute top-0 left-0 right-0 bottom-0 justify-center items-center'>
              <Center className='bg-jego-primary/20 rounded-full p-3'>
                <PlayIcon fill={'#f00'} color={'#f00'} size={40} />
              </Center>
            </View>
          )}
        </TouchableOpacity>
        <View className='w-full absolute bottom-0 left-0 right-0'>
          <View className='p-2'>
            <Text className='text-base text-white/70'>
              <Text>{data?.description.slice(0, 100) + '...'}</Text>
              <Text className='font-bold'>Voir plus</Text>
            </Text>
          </View>
          <Seeker
            currentTime={currentTime}
            duration={duration}
            isLoading={isLoading}
            videoSeek={(position) => {
              setIsSeeking(true)
              typeof videoRef !== 'function' && videoRef?.current?.seek(position)
            }}
            isUISeeking={isSeeking}
          />
        </View>
      </View>
      {data && (
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
      )}
    </SafeAreaView>
  )
}

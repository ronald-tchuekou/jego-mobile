import { BackButton } from '@/src/components/base/back-button'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Button, ButtonIcon, ButtonText } from '@/src/components/ui/button'
import { Center } from '@/src/components/ui/center'
import { HStack } from '@/src/components/ui/hstack'
import { Spinner } from '@/src/components/ui/spinner'
import { VStack } from '@/src/components/ui/vstack'
import { Overlay } from '@/src/components/video/overlay'
import { LikePostButton } from '@/src/features/posts/components/like-post-button'
import { SharePostButton } from '@/src/features/posts/components/share-post-button'
import useGetPostById from '@/src/features/posts/hooks/use-get-post-by-id'
import { env } from '@/src/lib/env'
import { IMAGES } from '@/src/lib/images'
import { audioTracksSelectionBy, bufferConfig, compactNumber, formatDate, textTracksSelectionBy } from '@/src/lib/utils'
import { useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { MessageCircleMoreIcon } from 'lucide-react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Dimensions, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Video, { AudioTrack, BufferingStrategyType, ControlsStyles, EnumValues, OnAudioFocusChangedData, OnAudioTracksData, OnBandwidthUpdateData, OnBufferData, OnLoadData, OnPlaybackRateChangeData, OnPlaybackStateChangedData, OnProgressData, OnSeekData, OnTextTrackDataChangedData, OnTextTracksData, OnVideoAspectRatioData, OnVideoErrorData, OnVideoTracksData, ResizeMode, SelectedTrack, SelectedTrackType, SelectedVideoTrack, SelectedVideoTrackType, TextTrack, VideoRef, VideoTrack } from 'react-native-video'
import { cnBase } from 'tailwind-variants'

const { width, height } = Dimensions.get('window')

const srcList = [
    {
    description: '(mp4) big buck bunny',
    uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
  },
  {
    description: '(mp4|subtitles) demo with sintel Subtitles',
    uri: 'http://www.youtube.com/api/manifest/dash/id/bf5bb2419360daf1/source/youtube?as=fmp4_audio_clear,fmp4_sd_hd_clear&sparams=ip,ipbits,expire,source,id,as&ip=0.0.0.0&ipbits=0&expire=19000000000&signature=51AF5F39AB0CEC3E5497CD9C900EBFEAECCCB5C7.8506521BFC350652163895D4C26DEE124209AA9E&key=ik0',
    type: 'mpd',
  },
]

export default function PostVideoPlayerScreen() {
  const [rate, setRate] = useState(1)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [resizeMode, setResizeMode] = useState<EnumValues<ResizeMode>>(ResizeMode.CONTAIN)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [, setVideoSize] = useState({ videoWidth: 0, videoHeight: 0 })
  const [paused, setPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([])
  const [textTracks, setTextTracks] = useState<TextTrack[]>([])
  const [videoTracks, setVideoTracks] = useState<VideoTrack[]>([])
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<SelectedTrack | undefined>(undefined)
  const [selectedTextTrack, setSelectedTextTrack] = useState<SelectedTrack | undefined>(undefined)
  const [selectedVideoTrack, setSelectedVideoTrack] = useState<SelectedVideoTrack>({
    type: SelectedVideoTrackType.AUTO,
  })
  const [srcListId, setSrcListId] = useState(0)
  const [repeat, setRepeat] = useState(false)
  const [controls, setControls] = useState(false)
  const [useCache, setUseCache] = useState(false)
  const [showPoster, setShowPoster] = useState<boolean>(false)
  const [showNotificationControls, setShowNotificationControls] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)

  // Add refs to store previous track data for comparison
  const videoRef = useRef<VideoRef>(null)
  const previousAudioTracksRef = useRef<AudioTrack[]>([])
  const previousTextTracksRef = useRef<TextTrack[]>([])

  const { post_id } = useLocalSearchParams<{ post_id: string }>()

  const { data, isLoading: isLoadingPost } = useGetPostById(post_id)

  const company = useMemo(() => data?.user?.company, [data])
  const companyLogo = useMemo(
    () => (company?.logo ? { uri: `${env.API_URL}/v1/${company?.logo}` } : IMAGES.default_company_logo),
    [company]
  )
  // const video = useMemo(() => data?.medias[0], [data])
  // const sourceUri = useMemo(() => {
  //   if (!video) return undefined
  //   return video.url.startsWith('http') ? video.url : `${env.API_URL}/v1/${video.url}`
  // }, [video])

  const currentSrc = srcList[srcListId]

  const goToChannel = useCallback((channel: number) => {
    setSrcListId(channel)
    setDuration(0)
    setCurrentTime(0)
    setVideoSize({ videoWidth: 0, videoHeight: 0 })
    setIsLoading(false)
    setAudioTracks([])
    setTextTracks([])
    setSelectedAudioTrack(undefined)
    setSelectedTextTrack(undefined)
    setSelectedVideoTrack({
      type: SelectedVideoTrackType.AUTO,
    })
  }, [])

  const channelUp = useCallback(() => {
    console.log('channel up')
    goToChannel((srcListId + 1) % srcList.length)
  }, [goToChannel, srcListId])

  const channelDown = useCallback(() => {
    console.log('channel down')
    goToChannel((srcListId + srcList.length - 1) % srcList.length)
  }, [goToChannel, srcListId])

  const onAudioTracks = (data: OnAudioTracksData) => {
    console.log('onAudioTracks', data)

    // Check if audio tracks have actually changed
    const currentTracks = data.audioTracks || []
    const previousTracks = previousAudioTracksRef.current

    // Simple comparison - check if tracks array length or selected track changed
    const tracksChanged =
      currentTracks.length !== previousTracks.length ||
      JSON.stringify(
        currentTracks.map((t) => ({
          index: t.index,
          selected: t.selected,
          language: t.language,
        }))
      ) !==
        JSON.stringify(
          previousTracks.map((t) => ({
            index: t.index,
            selected: t.selected,
            language: t.language,
          }))
        )

    if (!tracksChanged) {
      return // Skip if tracks haven't changed
    }

    previousAudioTracksRef.current = currentTracks

    const selectedTrack = currentTracks.find((x: AudioTrack) => {
      return x.selected
    })
    let value
    if (audioTracksSelectionBy === SelectedTrackType.INDEX) {
      value = selectedTrack?.index
    } else if (audioTracksSelectionBy === SelectedTrackType.LANGUAGE) {
      value = selectedTrack?.language
    } else if (audioTracksSelectionBy === SelectedTrackType.TITLE) {
      value = selectedTrack?.title
    }
    setAudioTracks(currentTracks)
    setSelectedAudioTrack({
      type: audioTracksSelectionBy,
      value: value,
    })
  }

  const onVideoTracks = (data: OnVideoTracksData) => {
    console.log('onVideoTracks', data.videoTracks)
    setVideoTracks(data.videoTracks)
  }

  const onTextTracks = (data: OnTextTracksData) => {
    // Check if text tracks have actually changed
    const currentTracks = data.textTracks || []
    const previousTracks = previousTextTracksRef.current

    // Simple comparison - check if tracks array length or selected track changed
    const tracksChanged =
      currentTracks.length !== previousTracks.length ||
      JSON.stringify(
        currentTracks.map((t) => ({
          index: t.index,
          selected: t.selected,
          language: t.language,
        }))
      ) !==
        JSON.stringify(
          previousTracks.map((t) => ({
            index: t.index,
            selected: t.selected,
            language: t.language,
          }))
        )

    if (!tracksChanged) {
      return // Skip if tracks haven't changed
    }

    previousTextTracksRef.current = currentTracks

    const selectedTrack = currentTracks.find((x: TextTrack) => {
      return x?.selected
    })

    setTextTracks(currentTracks)
    let value
    if (textTracksSelectionBy === SelectedTrackType.INDEX) {
      value = selectedTrack?.index
    } else if (textTracksSelectionBy === SelectedTrackType.LANGUAGE) {
      value = selectedTrack?.language
    } else if (textTracksSelectionBy === SelectedTrackType.TITLE) {
      value = selectedTrack?.title
    }
    setSelectedTextTrack({
      type: textTracksSelectionBy,
      value: value,
    })
  }

  const onLoad = (data: OnLoadData) => {
    setDuration(data.duration)
    onAudioTracks(data)
    onTextTracks(data)
    onVideoTracks(data)
  }

  const onProgress = (data: OnProgressData) => {
    setCurrentTime(data.currentTime)
  }

  const onSeek = (data: OnSeekData) => {
    setCurrentTime(data.currentTime)
    setIsSeeking(false)
  }

  const onVideoLoadStart = () => {
    console.log('onVideoLoadStart')
    setIsLoading(true)
  }

  const onTextTrackDataChanged = (data: OnTextTrackDataChangedData) => {
    console.log(`Subtitles: ${JSON.stringify(data, null, 2)}`)
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
    setPaused(true)
  }

  const onAudioFocusChanged = (event: OnAudioFocusChangedData) => {
    setPaused(!event.hasAudioFocus)
  }

  const onError = (err: OnVideoErrorData) => {
    console.log(JSON.stringify(err))
    Alert.alert('error: ' + JSON.stringify(err))
  }

  const onEnd = () => {
    if (!repeat) {
      channelUp()
    }
  }

  const onPlaybackRateChange = (data: OnPlaybackRateChangeData) => {
    console.log('onPlaybackRateChange', data)
  }

  const onPlaybackStateChanged = (data: OnPlaybackStateChangedData) => {
    console.log('onPlaybackStateChanged', data)
  }

  const onVideoBandwidthUpdate = (data: OnBandwidthUpdateData) => {
    console.log('onVideoBandwidthUpdate', data)
  }

  const _renderLoader = showPoster
    ? () => (
        <Center className='flex-1'>
          <Spinner size='large' className='text-jego-primary' />
        </Center>
      )
    : undefined

  const _subtitleStyle = { subtitlesFollowVideo: true }
  const _controlsStyles: ControlsStyles = {
    hideNavigationBarOnFullScreenMode: true,
    hideNotificationBarOnFullScreenMode: true,
    liveLabel: 'LIVE',
  }
  const _bufferConfig = useMemo(() => {
    return {
      ...bufferConfig,
      cacheSizeMB: useCache ? 200 : 0,
    }
  }, [useCache])

  useEffect(() => {
    videoRef.current?.setSource({ uri: currentSrc.uri, bufferConfig: _bufferConfig })
  }, [_bufferConfig, currentSrc])

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
        {(srcList[srcListId] as any)?.noView ? null : (
          <TouchableOpacity
            style={{
              width: width,
              height: height - 200,
            }}
          >
            <Video
              showNotificationControls={showNotificationControls}
              ref={videoRef}
              //            source={currentSrc as ReactVideoSource}
              style={{
                width: width,
                height: height - 200,
              }}
              rate={rate}
              paused={paused}
              volume={volume}
              muted={muted}
              controls={controls}
              resizeMode={resizeMode}
              onLoad={onLoad}
              onAudioTracks={onAudioTracks}
              onTextTracks={onTextTracks}
              onVideoTracks={onVideoTracks}
              onTextTrackDataChanged={onTextTrackDataChanged}
              onProgress={onProgress}
              onEnd={onEnd}
              progressUpdateInterval={1000}
              onError={onError}
              onAudioBecomingNoisy={onAudioBecomingNoisy}
              onAudioFocusChanged={onAudioFocusChanged}
              onLoadStart={onVideoLoadStart}
              onAspectRatio={onAspectRatio}
              onReadyForDisplay={onReadyForDisplay}
              onBuffer={onVideoBuffer}
              onBandwidthUpdate={onVideoBandwidthUpdate}
              onSeek={onSeek}
              repeat={repeat}
              selectedTextTrack={selectedTextTrack}
              selectedAudioTrack={selectedAudioTrack}
              selectedVideoTrack={selectedVideoTrack}
              playInBackground={false}
              preventsDisplaySleepDuringVideoPlayback={true}
              renderLoader={_renderLoader}
              onPlaybackRateChange={onPlaybackRateChange}
              onPlaybackStateChanged={onPlaybackStateChanged}
              bufferingStrategy={BufferingStrategyType.DEFAULT}
              debug={{ enable: true, thread: true }}
              subtitleStyle={_subtitleStyle}
              controlsStyles={_controlsStyles}
            />
          </TouchableOpacity>
        )}
        <Overlay
          channelDown={channelDown}
          channelUp={channelUp}
          ref={videoRef}
          videoTracks={videoTracks}
          selectedVideoTrack={selectedVideoTrack}
          setSelectedTextTrack={setSelectedTextTrack}
          audioTracks={audioTracks}
          controls={controls}
          resizeMode={resizeMode}
          textTracks={textTracks}
          selectedTextTrack={selectedTextTrack}
          selectedAudioTrack={selectedAudioTrack}
          setSelectedAudioTrack={setSelectedAudioTrack}
          setSelectedVideoTrack={setSelectedVideoTrack}
          currentTime={currentTime}
          setMuted={setMuted}
          muted={muted}
          duration={duration}
          paused={paused}
          volume={volume}
          setControls={setControls}
          showPoster={showPoster}
          rate={rate}
          setPaused={setPaused}
          isLoading={isLoading || isLoadingPost}
          isSeeking={isSeeking}
          setIsSeeking={setIsSeeking}
          repeat={repeat}
          setRepeat={setRepeat}
          setShowPoster={setShowPoster}
          setRate={setRate}
          setResizeMode={setResizeMode}
          setShowNotificationControls={setShowNotificationControls}
          showNotificationControls={showNotificationControls}
          setUseCache={setUseCache}
          setVolume={setVolume}
          useCache={useCache}
          srcListId={srcListId}
        />
      </View>
      {data && (
        <HStack className='justify-between px-1'>
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

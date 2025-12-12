import { useVideoPlayer, VideoView } from 'expo-video'
import { AlertCircleIcon, PlayIcon } from 'lucide-react-native'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { Center } from '../ui/center'
import { Icon } from '@/src/components/ui/icon'
import { cnBase } from 'tailwind-variants'
import { useEvent } from 'expo'
import { Spinner } from '@/src/components/ui/spinner'
import { PlayerIndicator } from '@/src/components/video/player-indicator'
import { Slider, SliderFilledTrack, SliderTrack } from '@/src/components/ui/slider'

type Props = {
  sourceUri: string
}

function VideoPlayer({ sourceUri }: Props) {
  const player = useVideoPlayer(
    {
      uri: sourceUri,
      useCaching: Platform.OS === 'android',
    },
    (player) => {
      player.play()
      player.loop = true
    },
  )

  // evets
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing })
  const { status, error } = useEvent(player, 'statusChange', { status: player.status })

  return (
    <>
      <View className='flex-1 relative'>
        {error ? (
          <View className='flex-1 flex items-center justify-center gap-3 text-muted-foreground p-16'>
            <Icon
              as={AlertCircleIcon}
              size={'lg'}
              style={{ width: 50, height: 50 }}
              className='text-jego-muted-foreground'
            />
            <Text className='text-base text-jego-muted-foreground text-center'>
              Nous avons rencontré un problème lors de la récupération de la vidéo.
            </Text>
          </View>
        ) : (
          <VideoView player={player} nativeControls={false} style={{ flex: 1 }} className={'bg-black'} />
        )}
        {!error && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (!isPlaying) {
                player.play()
              } else {
                player.pause()
              }
            }}
            className={cnBase(
              'absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/40',
              (isPlaying || status !== 'loading') && 'bg-transparent',
            )}
          >
            {status === 'loading' ? (
              <Center className='bg-white/30 rounded-full border border-white/70 p-5'>
                <Spinner className={'text-jego-primary'} size={'large'} />
              </Center>
            ) : !isPlaying ? (
              <Center className='bg-white/30 rounded-full border border-white/70 p-5'>
                <Icon
                  as={PlayIcon}
                  className={'text-jego-primary fill-jego-primary'}
                  style={{ width: 40, height: 40 }}
                />
              </Center>
            ) : null}
          </TouchableOpacity>
        )}
      </View>
      <View className={'w-full p-1'}>
        {status !== 'loading' && !error ? (
          <PlayerIndicator player={player} />
        ) : (
          <Slider
            defaultValue={player.currentTime}
            value={player.currentTime}
            maxValue={player.duration}
            size='sm'
            orientation='horizontal'
            isDisabled={false}
            isReversed={false}
          >
            <SliderTrack className={'bg-white/50'}>
              <SliderFilledTrack className={'bg-jego-primary'} />
            </SliderTrack>
          </Slider>
        )}
      </View>
    </>
  )
}

export default VideoPlayer

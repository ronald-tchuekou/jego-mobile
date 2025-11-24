import { useEvent } from 'expo'
import { useVideoPlayer, VideoView } from 'expo-video'
import { PlayIcon } from 'lucide-react-native'
import { memo, useRef, useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Center } from '../ui/center'

const { width, height } = Dimensions.get('window')

type Props = {
  sourceUri: string
}

function VideoPlayer({ sourceUri }: Props) {
  // Refs
  const wasPlayingRef = useRef(false)

  // States
  const [paused] = useState(false)
  const [progressBarWidth, setProgressBarWidth] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [seekingProgress, setSeekingProgress] = useState<number | null>(null)

  const player = useVideoPlayer(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    (player) => {
      player.play()
      player.addListener('statusChange', (status) => {
        console.log('status', status)
      })
    },
  )

  // Reactive player states
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing })
  // Trigger re-renders on time updates; read values from the player
  useEvent(player, 'timeUpdate')
  const currentTime = player.currentTime ?? 0
  // Some type definitions may not expose duration; fall back to 0 if missing
  const duration = (player as any).duration ?? 0

  const effectiveProgress =
    duration > 0 ? (isSeeking && seekingProgress !== null ? seekingProgress : currentTime / duration) : 0

  function clamp(value: number, min: number, max: number) {
    'worklet'
    return Math.max(min, Math.min(max, value))
  }

  function progressFromX(x: number) {
    if (progressBarWidth <= 0) return 0
    return clamp(x / progressBarWidth, 0, 1)
  }

  function handleSeekPreview(x: number) {
    if (duration <= 0) return
    const nextProgress = progressFromX(x)
    setSeekingProgress(nextProgress)
  }

  function handleSeekCommit(x: number) {
    if (duration <= 0) return
    const nextProgress = progressFromX(x)
    const nextTime = nextProgress * duration
    player.currentTime = nextTime
    setSeekingProgress(null)
    setIsSeeking(false)
    if (wasPlayingRef.current) {
      player.play()
      wasPlayingRef.current = false
    }
  }

  function handleSeekStart(x: number) {
    if (duration <= 0) return
    wasPlayingRef.current = isPlaying
    if (isPlaying) {
      player.pause()
    }
    setIsSeeking(true)
    handleSeekPreview(x)
  }

  return (
    <TouchableOpacity style={styles.video} className='relative'>
      <VideoView player={player} nativeControls={false} style={styles.video} />
      {paused && (
        <View className='absolute top-0 left-0 right-0 bottom-0 justify-center items-center'>
          <Center className='bg-jego-primary/20 rounded-full p-3'>
            <PlayIcon fill={'#f00'} color={'#f00'} size={40} />
          </Center>
        </View>
      )}
      {/* Progress bar overlay */}
      <View
        className='absolute left-0 right-0'
        style={styles.progressContainer}
        onLayout={(e) => setProgressBarWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(e) => handleSeekStart(e.nativeEvent.locationX)}
        onResponderMove={(e) => handleSeekPreview(e.nativeEvent.locationX)}
        onResponderRelease={(e) => handleSeekCommit(e.nativeEvent.locationX)}
      >
        <View style={styles.progressTrack} />
        <View style={[styles.progressFill, { width: effectiveProgress * progressBarWidth }]} />
        <View style={[styles.progressThumb, { left: effectiveProgress * progressBarWidth - THUMB_RADIUS }]} />
      </View>
    </TouchableOpacity>
  )
}

const THUMB_RADIUS = 6

const styles = StyleSheet.create({
  video: {
    width: width,
    height: height - 250,
  },
  progressContainer: {
    bottom: 12,
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  progressTrack: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  progressFill: {
    position: 'absolute',
    left: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  progressThumb: {
    position: 'absolute',
    top: (24 - THUMB_RADIUS * 2) / 2,
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    backgroundColor: '#FFFFFF',
  },
})

export default memo(VideoPlayer)

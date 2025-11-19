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
  const videoRef = useRef<VideoView>(null)

  // States
  const [paused] = useState(false)

  const player = useVideoPlayer(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    (player) => {
      player.play()
      player.addListener('statusChange', (status) => {
        console.log('status', status)
      })
    }
  )

  return (
    <TouchableOpacity style={styles.video} className='relative'>
      <VideoView ref={videoRef} player={player} nativeControls={false} style={styles.video} />
      {paused && (
        <View className='absolute top-0 left-0 right-0 bottom-0 justify-center items-center'>
          <Center className='bg-jego-primary/20 rounded-full p-3'>
            <PlayIcon fill={'#f00'} color={'#f00'} size={40} />
          </Center>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  video: {
    width: width,
    height: height - 250,
  },
})

export default memo(VideoPlayer)

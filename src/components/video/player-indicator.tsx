import { VideoPlayer } from 'expo-video'
import { useEffect, useState } from 'react'
import { Slider, SliderFilledTrack, SliderTrack } from '@/src/components/ui/slider'

type Props = {
  player: VideoPlayer
}

export const PlayerIndicator = ({ player }: Props) => {
  const [currentTime, setCurrentTime] = useState(player.currentTime || 0)
  const [duration, setDuration] = useState(player.duration || 0)

  useEffect(() => {
    if (!player) return

    // Poll for time updates
    const interval = setInterval(() => {
      setDuration(player.duration)
      setCurrentTime(player.currentTime)
    }, 1000)

    return () => clearInterval(interval)
  }, [currentTime, duration, player])

  return (
    <Slider
      defaultValue={player.currentTime}
      value={currentTime}
      maxValue={duration}
      size='sm'
      orientation='horizontal'
      isDisabled={false}
      isReversed={false}
    >
      <SliderTrack className={'bg-white/50'}>
        <SliderFilledTrack className={'bg-primary'} />
      </SliderTrack>
    </Slider>
  )
}

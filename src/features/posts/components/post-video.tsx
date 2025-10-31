import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AccessibilityInfo, Pressable, View } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { env } from '@/src/lib/env'
import { MediaModel } from '@/src/services/post-service'
import { PlayIcon, Volume2Icon, VolumeXIcon } from 'lucide-react-native'

export type PostVideoProps = {
  medias: MediaModel[]
}

// A lightweight, Instagram-like video player optimized for feed usage
export function PostVideo({ medias }: PostVideoProps) {
  const media = medias?.[0]
  const sourceUri = useMemo(() => {
    if (!media) return undefined
    return media.url.startsWith('http') ? media.url : `${env.API_URL}/v1/${media.url}`
  }, [media])

  const posterUri = useMemo(() => {
    if (!media?.thumbnailUrl) return undefined
    return media.thumbnailUrl.startsWith('http') ? media.thumbnailUrl : `${env.API_URL}/v1/${media.thumbnailUrl}`
  }, [media])

  const viewRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState({ positionMillis: 0, durationMillis: 0 })

  // Initialize video player with expo-video
  const player = useVideoPlayer(sourceUri ? { uri: sourceUri } : (null as any))

  // Ensure initial playback, mute and looping like Instagram
  useEffect(() => {
    const p: any = player as any
    if (!p) return
    // try-catch to avoid crashing on platforms not yet ready
    try {
      p.play?.()
      p.setIsMuted ? p.setIsMuted(true) : (p.muted = true)
      if (p.setIsLooping) p.setIsLooping(true)
      else if ('loop' in p) p.loop = true
    } catch {}
  }, [player])

  // Poll progress at ~4fps to minimize re-renders
  useEffect(() => {
    let mounted = true
    const i = setInterval(() => {
      try {
        const status: any = (player as any)?.status ?? {}
        const isLoaded = status != null
        if (!isLoaded) return
        const playing = !!status.isPlaying || !!status.playing
        const muted = status.isMuted ?? status.muted
        const position = status.positionMillis ?? Math.floor((status.currentTime ?? 0) * 1000)
        const duration = status.durationMillis ?? Math.floor((status.duration ?? 0) * 1000)
        if (mounted) {
          setIsPlaying(playing)
          setIsMuted(!!muted)
          setProgress({ positionMillis: position || 0, durationMillis: duration || 0 })
        }
      } catch {}
    }, 250)
    return () => {
      mounted = false
      clearInterval(i)
    }
  }, [player])

  const togglePlay = useCallback(() => {
    const p: any = player as any
    if (!p) return
    if (isPlaying) p.pause?.()
    else p.play?.()
    setIsPlaying((v) => !v)
  }, [player, isPlaying])

  const toggleMute = useCallback(() => {
    const p: any = player as any
    if (!p) return
    const next = !isMuted
    p.setIsMuted ? p.setIsMuted(next) : p.muted !== undefined ? (p.muted = next) : null
    setIsMuted(next)
    AccessibilityInfo.announceForAccessibility?.(next ? 'Muted' : 'Unmuted')
  }, [player, isMuted])

  const progressPct = useMemo(() => {
    const { positionMillis, durationMillis } = progress
    if (!durationMillis) return 0
    return Math.max(0, Math.min(1, positionMillis / durationMillis))
  }, [progress])

  if (!sourceUri) return null

  return (
    <View className='relative mb-4' style={{ height: 400 }}>
      <Pressable
        onPress={togglePlay}
        accessibilityRole='button'
        accessibilityLabel={isPlaying ? 'Pause video' : 'Play video'}
      >
        <VideoView
          ref={viewRef}
          player={player}
          // Maintain same sizing and layout as images
          style={
            media?.metadata?.aspectRatio
              ? ({ aspectRatio: media.metadata.aspectRatio.replace(':', '/') as any } as any)
              : undefined
          }
          className={`w-full h-[400px] bg-black ${media?.metadata?.aspectRatio ? `aspect-${media.metadata.aspectRatio}` : 'aspect-video'}`}
          contentFit='contain'
          // Disable native controls for Instagram-like UI
          allowsFullscreen={false}
          allowsPictureInPicture={true}
        />
      </Pressable>

      {!isPlaying && (
        <View pointerEvents='none' className='absolute inset-0 items-center justify-center'>
          <PlayIcon size={48} color='#ffffff' />
        </View>
      )}

      <View className='absolute bottom-0 left-0 right-0 px-3 pb-3 pt-2'>
        <View className='flex-row items-center justify-between'>
          <Pressable
            onPress={toggleMute}
            accessibilityRole='button'
            accessibilityLabel={isMuted ? 'Unmute video' : 'Mute video'}
            hitSlop={10}
            className='p-2 rounded-full bg-black/40'
          >
            {isMuted ? <VolumeXIcon size={20} color='#fff' /> : <Volume2Icon size={20} color='#fff' />}
          </Pressable>
        </View>
        <View className='mt-2 h-1.5 rounded-full bg-white/30 overflow-hidden'>
          <View style={{ width: `${progressPct * 100}%` }} className='h-full bg-white' />
        </View>
      </View>
    </View>
  )
}

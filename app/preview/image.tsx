import { BackButton } from '@/src/components/base/back-button'
import { useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'
import { StatusBar, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

type Params = {
  url?: string
  tag?: string
  title?: string
}

export default function ImagePreviewScreen() {
  const { url, tag } = useLocalSearchParams<Params>()

  const scale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }, { translateY: translateY.value }],
  }))

  const pinch = useMemo(
    () =>
      Gesture.Pinch()
        .onUpdate((e) => {
          const next = Math.min(Math.max(1, e.scale), 4)
          scale.value = next
        })
        .onEnd(() => {
          if (scale.value < 1) scale.value = withTiming(1)
        }),
    [scale]
  )

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((e) => {
          if (scale.value > 1) {
            translateX.value = e.translationX
            translateY.value = e.translationY
          }
        })
        .onEnd(() => {
          if (scale.value <= 1) {
            translateX.value = withTiming(0)
            translateY.value = withTiming(0)
          }
        }),
    [scale, translateX, translateY]
  )

  const doubleTap = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
          if (scale.value > 1) {
            scale.value = withTiming(1)
            translateX.value = withTiming(0)
            translateY.value = withTiming(0)
          } else {
            scale.value = withTiming(2)
          }
        }),
    [scale, translateX, translateY]
  )

  const composed = Gesture.Simultaneous(doubleTap, Gesture.Simultaneous(pinch, pan))

  if (!url) return null

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle='light-content' />

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 10, zIndex: 10 }}>
        <View style={{ paddingHorizontal: 12, paddingTop: 16 }}>
          <BackButton />
        </View>
      </View>

      <GestureDetector gesture={composed}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.Image
            source={{ uri: url }}
            resizeMode='contain'
            // @ts-expect-error reanimated shared transitions prop
            sharedTransitionTag={tag || undefined}
            style={[{ width: '100%', height: '100%' }, animatedStyle]}
            onLoadStart={() => {
              // keep default
            }}
            onError={() => {
              // noop; could show toast
            }}
            defaultSource={undefined}
          />
          {/* Center loader overlay while image loads if needed */}
          {/* ActivityIndicator reserved for slow loads via expo-image in future */}
        </View>
      </GestureDetector>
    </View>
  )
}

import { BackButton } from '@/src/components/base/back-button'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { StatusBar, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { VStack } from '@/src/components/ui/vstack'
import { HStack } from '@/src/components/ui/hstack'
import EmptyContent from '@/src/components/base/empty-content'
import { Spinner } from '@/src/components/ui/spinner'

type Params = {
  url?: string
  tag?: string
  title?: string
}

export default function ImagePreviewScreen() {
  const { url, tag } = useLocalSearchParams<Params>()

  const insets = useSafeAreaInsets()

  const [onError, setOnError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const scale = useSharedValue(1)
  const startScale = useSharedValue(0)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }, { translateY: translateY.value }],
  }))

  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max)
  }

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value
    })
    .onUpdate((e) => {
      scale.value = clamp(startScale.value * e.scale, 1, 4)
      //scale.value = Math.min(Math.max(1, e.scale), 4)
    })
    .runOnJS(true)
  //.onEnd(() => {
  //if (scale.value < 1) scale.value = withTiming(1)
  //})

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value > 1) {
        translateX.value = e.translationX
        translateY.value = e.translationY
      }
    })
    .runOnJS(true)
  //.onEnd(() => {
  //if (scale.value <= 1) {
  //translateX.value = withTiming(0)
  //translateY.value = withTiming(0)
  //}
  //})

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1)
        translateX.value = withTiming(0)
        translateY.value = withTiming(0)
      } else {
        scale.value = withTiming(2)
      }
    })

  const composed = Gesture.Simultaneous(doubleTap, Gesture.Simultaneous(pinch, pan))

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black', position: 'relative' }}>
      <StatusBar barStyle='light-content' />
      <HStack
        space='md'
        style={{ top: insets.top + 10 }}
        className='p-4 absolute top-0 left-0 z-10 bg-jego-transparent items-center'
      >
        <BackButton iconClassName={'text-white'} />
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-white' numberOfLines={1}>
            {url || "Pas d'image"}
          </Text>
        </VStack>
      </HStack>

      {onError ? (
        <EmptyContent text={"Cette image n'existe pas."} />
      ) : (
        <GestureDetector gesture={composed}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.Image
              source={{ uri: url }}
              resizeMode='contain'
              alt={tag || ''}
              style={[{ width: '100%', height: '100%' }, animatedStyle]}
              onLoadStart={() => {
                setIsLoading(true)
                setOnError(false)
              }}
              onLoadEnd={() => {
                setIsLoading(false)
              }}
              onError={() => {
                setOnError(true)
              }}
              defaultSource={undefined}
            />
            {/* Center loader overlay while image loads if needed */}
            {/* ActivityIndicator reserved for slow loads via expo-image in future */}
            {isLoading && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner size={'large'} className={'text-jego-primary'} />
              </View>
            )}
          </View>
        </GestureDetector>
      )}
    </SafeAreaView>
  )
}

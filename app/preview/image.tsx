import { BackButton } from '@/src/components/base/back-button'
import EmptyContent from '@/src/components/base/empty-content'
import { Center } from '@/src/components/ui/center'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Dimensions, StatusBar, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

type Params = {
  url?: string
  tag?: string
  title?: string
}

const { width, height } = Dimensions.get('window')

export default function ImagePreviewScreen() {
  const { url, tag, title } = useLocalSearchParams<Params>()
  const insets = useSafeAreaInsets()

  const [onError, setOnError] = useState(false)

  const savedTransitions = useSharedValue({ x: 0, y: 0 })
  const translationX = useSharedValue(0)
  const translationY = useSharedValue(0)
  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translationX.value }, { translateY: translationY.value }, { scale: scale.value }],
    }
  })

  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max)
  }

  function resetAll() {
    translationX.value = withTiming(0)
    translationY.value = withTiming(0)
    savedTransitions.value = { x: 0, y: 0 }
    scale.value = withTiming(1)
    savedScale.value = 1
  }

  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      if (savedScale.value > 1) {
        const maxTranslateX = (width * scale.value) / 2 - width / 2
        const maxTranslateY = (height * scale.value) / 2 - height

        translationX.value = clamp(savedTransitions.value.x + e.translationX, -maxTranslateX, maxTranslateX)
        translationY.value = clamp(savedTransitions.value.y + e.translationY, -maxTranslateY, maxTranslateY)
      }
    })
    .onEnd(() => {
      savedTransitions.value = {
        x: translationX.value,
        y: translationY.value,
      }
    })
    .runOnJS(true)

  const zoomGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = clamp(savedScale.value * event.scale, 1, 4)
    })
    .onEnd(() => {
      savedScale.value = scale.value
    })
    .runOnJS(true)

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        resetAll()
      } else {
        scale.value = withTiming(4)
        savedScale.value = 4
      }
    })
    .runOnJS(true)

  const composed = Gesture.Simultaneous(dragGesture, Gesture.Simultaneous(zoomGesture, doubleTap))

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black', position: 'relative' }}>
      <StatusBar barStyle='light-content' />
      <HStack
        space='md'
        style={{ top: insets.top }}
        className='px-4 absolute top-0 left-0 z-10 bg-transparent items-center'
      >
        <BackButton iconClassName={'text-white'} />
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-white' numberOfLines={1}>
            {title || url || "Pas d'image"}
          </Text>
        </VStack>
      </HStack>

      {onError ? (
        <Center className={'flex-1'}>
          <EmptyContent text={"Cette image n'existe pas."} />
        </Center>
      ) : (
        <GestureDetector gesture={composed}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.Image
              source={{ uri: url, cache: 'force-cache' }}
              resizeMode='contain'
              alt={tag || ''}
              style={[{ width: '100%', height: '100%' }, animatedStyles]}
              onLoadStart={() => {
                setOnError(false)
              }}
              onError={() => {
                setOnError(true)
              }}
            />
          </View>
        </GestureDetector>
      )}
    </SafeAreaView>
  )
}

import { HStack } from '@/src/components/ui/hstack'
import { TextInput, View } from 'react-native'
import { Button, ButtonIcon, ButtonSpinner } from '@/src/components/ui/button'
import React from 'react'
import { IconSend2 } from '@tabler/icons-react-native'
import { AnimatedView } from 'react-native-reanimated/src/component/View'
import useGranularAnimation from '@/src/hooks/use-granular-animation'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAnimatedStyle } from 'react-native-reanimated'

type Props = {
  message?: string
  isLoading?: boolean
  sendMessage: (message: string) => void
}

export const ChatInput = ({ message, isLoading, sendMessage }: Props) => {
  const insets = useSafeAreaInsets()

  const [value, setValue] = React.useState('')

  const height = useGranularAnimation()
  const fakeView = useAnimatedStyle(() => ({ height: height.height.value - insets.bottom }))

  function send() {
    sendMessage(value.trim())
    setValue('')
  }

  return (
    <View className={'px-4 border-t border-input bg-card'}>
      <HStack space={'sm'} className={'items-end py-3'}>
        <TextInput
          multiline
          numberOfLines={10}
          className={'flex-1 px-3 py-3 bg-input border-border border rounded-lg text-foreground'}
          placeholder={'Taper votre message...'}
          defaultValue={message}
          value={value}
          onChangeText={setValue}
          placeholderTextColor={'#9CA3AF'}
          style={{ fontSize: 14 }}
          textAlignVertical={'top'}
          autoCapitalize={'sentences'}
          autoCorrect={true}
        />
        <Button size={'icon-lg'} isDisabled={!value.trim() || isLoading} onPress={send}>
          {isLoading ? <ButtonSpinner className={'text-primary-foreground'} /> : <ButtonIcon as={IconSend2} />}
        </Button>
      </HStack>
      <AnimatedView style={fakeView} />
    </View>
  )
}

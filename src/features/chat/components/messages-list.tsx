import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { Icon } from '@/src/components/ui/icon'
import { globalStyles } from '@/src/lib/global-styles'
import { IMAGES } from '@/src/lib/images'
import { chatKey } from '@/src/lib/query-kye'
import { getFullUrl } from '@/src/lib/utils'
import ChatService, { MessageType } from '@/src/services/chat-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { IconSend2 } from '@tabler/icons-react-native'
import { useQueryClient } from '@tanstack/react-query'
import 'dayjs/locale/fr'
import { useColorScheme } from 'nativewind'
import { useState } from 'react'
import { Platform } from 'react-native'
import { Bubble, GiftedChat, IMessage, InputToolbar, Send } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import useGetMessages from '../hooks/use-get-messages'

type Props = {
  conversationId: string
}

export default function MessagesList({ conversationId }: Props) {
  const auth = useAuthStore((state) => state.auth)
  const { isLoading, data } = useGetMessages(conversationId)
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const theme = isDark ? 'dark' : 'light'
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()

  const [text, setText] = useState('')

  const messages: IMessage[] =
    data?.map(
      (message) =>
        ({
          _id: message.id,
          text: message.content || '',
          createdAt: new Date(message.createdAt),
          user: {
            _id: message.sender.id,
            name: `${message.sender.firstName} ${message.sender.lastName}`.trim(),
            avatar: message.sender.profileImage ? getFullUrl(message.sender.profileImage) : IMAGES.default_user_avatar,
          },
        }) as IMessage,
    ) || []

  const user = auth?.user
  const tabbarHeight = 50
  const keyboardTopToolbarHeight = Platform.select({ ios: 44, default: 0 })
  const keyboardVerticalOffset = insets.bottom + tabbarHeight + keyboardTopToolbarHeight

  const onSend = async () => {
    if (!auth?.token)
      return Toast.show({
        text1: 'Oops !',
        text2: 'Une erreur est survenue, veuillez reprendre.',
        type: 'error',
        visibilityTime: 6000,
      })

    try {
      await ChatService.sendMessage(
        {
          conversationId,
          content: text,
          type: MessageType.TEXT,
        },
        auth?.token || '',
      )

      // Invalidate and refetch messages
      queryClient
        .invalidateQueries({
          queryKey: chatKey.all,
        })
        .then()
    } catch (error) {
      Toast.show({
        text1: 'Oops !',
        text2: 'Une erreur est survenue, veuillez reprendre.',
        type: 'error',
        visibilityTime: 6000,
      })
      console.error('Failed to send message:', error)
    }
  }

  return (
    <GiftedChat
      locale='fr-FR'
      text={text}
      isSendButtonAlwaysVisible
      isAvatarOnTop={false}
      isAvatarVisibleForEveryMessage={false}
      isUserAvatarVisible={false}
      messages={messages}
      onSend={onSend}
      user={{
        _id: user?.id || 1,
        name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        avatar: user?.profileImage ? getFullUrl(user?.profileImage) : IMAGES.default_user_avatar,
      }}
      renderChatEmpty={() => (isLoading ? <LoaderContent /> : <EmptyContent text='.' />)}
      renderBubble={(props) => (
        <Bubble
          {...props}
          textStyle={{
            right: {
              color: globalStyles.colors['primary-foreground'][theme],
            },
            left: {
              color: globalStyles.colors['card-foreground'][theme],
            },
          }}
          wrapperStyle={{
            right: {
              backgroundColor: globalStyles.colors.primary[theme],
            },
            left: {
              backgroundColor: globalStyles.colors.card[theme],
              borderWidth: 0.5,
              borderColor: globalStyles.colors.border[theme],
            },
          }}
        />
      )}
      messagesContainerStyle={{ backgroundColor: globalStyles.colors.background[theme], borderWidth: 0 }}
      textInputProps={{
        value: text,
        numberOfLines: 5,
        style: {
          backgroundColor: globalStyles.colors.muted[theme],
          color: globalStyles.colors['foreground'][theme],
          borderRadius: 15,
          padding: 10,
          borderWidth: 0.5,
          borderColor: globalStyles.colors.border[theme],
          marginRight: 8,
        },
        onChangeText: setText,
      }}
      renderSend={(props) => {
        const disabled = !(props.text ?? '').trim()
        return (
          <Send
            {...props}
            containerStyle={{
              height: 40,
              width: 40,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: disabled ? 0.4 : 1,
              backgroundColor: globalStyles.colors.primary[theme],
            }}
          >
            <Icon as={IconSend2} style={{ height: 30, width: 30 }} className='text-jego-primary-foreground' />
          </Send>
        )
      }}
      renderInputToolbar={(props) => (
        <InputToolbar
          {...props}
          containerStyle={{
            padding: 8,
            gap: 10,
            borderWidth: 0,
            backgroundColor: globalStyles.colors.card[theme],
          }}
        />
      )}
      keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
    />
  )
}

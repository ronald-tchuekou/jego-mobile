import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { Icon } from '@/src/components/ui/icon'
import { globalStyles } from '@/src/lib/global-styles'
import { IMAGES } from '@/src/lib/images'
import { getFullUrl } from '@/src/lib/utils'
import { useAuthStore } from '@/src/stores/auth-store'
import { IconSend2 } from '@tabler/icons-react-native'
import 'dayjs/locale/fr'
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat'
import useMessages from '../hooks/use-messages'
import useTheme from '@/src/hooks/use-theme'
import React from 'react'
import { ChatInput } from '@/src/features/chat/components/chat-input'

type Props = {
  conversationId: string
}

export default function MessagesList({ conversationId }: Props) {
  const auth = useAuthStore((state) => state.auth)
  const { isLoading, messages, sendMessage, isSendingMessage } = useMessages(conversationId)
  const theme = useTheme()

  const user = auth?.user

  return (
    <>
      <GiftedChat
        locale='fr'
        isSendButtonAlwaysVisible
        isInverted={messages.length !== 0}
        isAvatarOnTop={false}
        isAvatarVisibleForEveryMessage={false}
        isUserAvatarVisible={false}
        messages={messages}
        dateFormatCalendar={{
          sameDay: "[Aujourd'hui]",
          lastDay: '[Hier]', // The day before ( Yesterday at 2:30 AM )
        }}
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
          numberOfLines: 5,
          style: {
            backgroundColor: globalStyles.colors.input[theme],
            color: globalStyles.colors['foreground'][theme],
            borderRadius: 15,
            padding: 10,
            borderWidth: 0.5,
            borderColor: globalStyles.colors.border[theme],
            marginRight: 8,
          },
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
              <Icon as={IconSend2} style={{ height: 28, width: 28 }} className='text-primary-foreground' />
            </Send>
          )
        }}
        renderInputToolbar={() => null}
      />
      <ChatInput sendMessage={sendMessage} isLoading={isSendingMessage} />
    </>
  )
}

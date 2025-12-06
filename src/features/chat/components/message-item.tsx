import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import { fmtMsgTime, getUserProfileImageUri } from '@/src/lib/utils'
import { Message } from '@/src/services/chat-service'
import { Text, View } from 'react-native'

type Props = {
  message: Message
  isMyMessage: boolean
}

export default function MessageItem({ message, isMyMessage }: Props) {
  return (
    <View
      className={`flex-row gap-3 ${isMyMessage ? 'flex-row-reverse' : ''}`}
      style={{ marginBottom: 16 }}
    >
      <Avatar size='sm'>
        <AvatarImage source={getUserProfileImageUri(message.sender.profileImage)} />
      </Avatar>
      <VStack
        className={`max-w-[70%] ${isMyMessage ? 'items-end' : ''}`}
        space='xs'
      >
        <View
          className={`rounded-lg px-3 py-2 ${
            isMyMessage
              ? 'bg-jego-primary'
              : 'bg-jego-card border border-jego-border'
          }`}
        >
          <Text
            className={`text-sm ${
              isMyMessage ? 'text-white' : 'text-jego-foreground'
            }`}
          >
            {message.content}
          </Text>
          {message.attachments && message.attachments.length > 0 && (
            <VStack className='mt-2' space='xs'>
              {message.attachments.map((attachment) => (
                <Text
                  key={attachment.id}
                  className={`text-xs opacity-75 ${
                    isMyMessage ? 'text-white' : 'text-jego-muted-foreground'
                  }`}
                >
                  📎 {attachment.name}
                </Text>
              ))}
            </VStack>
          )}
        </View>
        <Text className='text-xs text-jego-muted-foreground'>
          {fmtMsgTime(new Date(message.createdAt))}
        </Text>
      </VStack>
    </View>
  )
}


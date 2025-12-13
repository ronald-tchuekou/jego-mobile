import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import { fmtMsgTime, getUserProfileImageUri } from '@/src/lib/utils'
import { Conversation, Message } from '@/src/services/chat-service'
import { UserModel } from '@/src/services/auth-service'
import { Pressable, Text } from 'react-native'

type Props = {
  conversation: Conversation
  currentUserId: string
  onPress: () => void
}

export default function ConversationItem({ conversation, currentUserId, onPress }: Props) {
  const getOtherParticipant = (): UserModel | null => {
    const participant1 = conversation.participants[0]
    const participant2 = conversation.participants[1]

    if (participant1?.userId === currentUserId) {
      return participant2?.user || null
    }

    return participant1?.user || null
  }

  const getLastMessage = (): Message | null => {
    return conversation.messages?.[0] || null // API returns last message first
  }

  const otherParticipant = getOtherParticipant()
  const lastMessage = getLastMessage()

  if (!otherParticipant) return null

  return (
    <Pressable onPress={onPress} className='flex-row items-center gap-3 p-4 border-b border-border active:bg-card'>
      <Avatar size='md'>
        <AvatarImage source={getUserProfileImageUri(otherParticipant.profileImage)} />
      </Avatar>
      <VStack className='flex-1 min-w-0' space='xs'>
        <HStack className='items-center justify-between'>
          <Text className='font-semibold text-base text-foreground' numberOfLines={1}>
            {otherParticipant.firstName} {otherParticipant.lastName}
          </Text>
          {lastMessage && (
            <Text className='text-xs text-muted-foreground'>{fmtMsgTime(new Date(lastMessage.createdAt))}</Text>
          )}
        </HStack>
        <Text className='text-sm text-muted-foreground' numberOfLines={1}>
          {lastMessage?.content || '- - -'}
        </Text>
      </VStack>
    </Pressable>
  )
}

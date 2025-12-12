import { BackButton } from '@/src/components/base/back-button'
import EmptyContent from '@/src/components/base/empty-content'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import MessagesList from '@/src/features/chat/components/messages-list'
import useGetConversation from '@/src/features/chat/hooks/use-get-conversation'
import { getUserProfileImageUri } from '@/src/lib/utils'
import { useAuthStore } from '@/src/stores/auth-store'
import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderContainer } from '@/src/components/base/header-container'

export default function ConversationScreen() {
  const { conversation_id } = useLocalSearchParams<{ conversation_id: string }>()
  const { data: conversation } = useGetConversation(conversation_id || null)
  const auth = useAuthStore((state) => state.auth)
  const currentUserId = auth?.user?.id

  const getOtherParticipant = () => {
    if (!conversation?.participants || conversation.participants.length < 2) return null

    const participant1 = conversation.participants[0]
    const participant2 = conversation.participants[1]

    if (participant1?.userId === currentUserId) {
      return participant2?.user || null
    }

    return participant1?.user || null
  }

  const otherParticipant = getOtherParticipant()

  if (!conversation_id) return <EmptyContent text='Aucune conversation sélectionnée' />

  return (
    <SafeAreaView className='flex-1 bg-jego-card'>
      <HeaderContainer withTopInset={false}>
        <HStack space='md' className='items-center'>
          <BackButton />
          <Avatar size='md'>
            <AvatarImage source={getUserProfileImageUri(otherParticipant?.profileImage) as any} />
          </Avatar>
          <VStack className='flex-1'>
            <Text className='font-semibold text-lg text-jego-foreground' numberOfLines={1}>
              {otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Utilisateur'}
            </Text>
          </VStack>
        </HStack>
      </HeaderContainer>

      <View className={'bg-jego-background flex-1'}>
        <MessagesList conversationId={conversation_id} />
      </View>
    </SafeAreaView>
  )
}

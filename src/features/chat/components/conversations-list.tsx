import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { useAuthStore } from '@/src/stores/auth-store'
import { useRouter } from 'expo-router'
import { FlatList, RefreshControl } from 'react-native'
import useGetContacts from '../hooks/use-get-contacts'
import ConversationItem from './conversation-item'

type Props = {
  search?: string
}

export default function ConversationsList({ search }: Props) {
  const { isLoading, data, refetch, isRefetching} = useGetContacts()
  const router = useRouter()
  const auth = useAuthStore((state) => state.auth)
  const currentUserId = auth?.user?.id

  const filteredConversations = search
    ? data?.filter((conversation) => {
        const participant1 = conversation.participants[0]
        const participant2 = conversation.participants[1]
        const otherParticipant = participant1?.userId === currentUserId ? participant2?.user : participant1?.user

        if (!otherParticipant) return false

        const fullName = `${otherParticipant.firstName} ${otherParticipant.lastName}`.toLowerCase()
        const searchLower = search.toLowerCase()
        return fullName.includes(searchLower) || otherParticipant.email?.toLowerCase().includes(searchLower)
      })
    : data

  const handlePress = (conversationId: string) => {
    router.push(`/chat/${conversationId}`)
  }

  return (
    <FlatList
      className='flex-1'
      data={filteredConversations || []}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      ListEmptyComponent={isLoading ? <LoaderContent /> : <EmptyContent text={'Pas de conversation pour le moment.'} />}
      renderItem={({ item }) => (
        <ConversationItem
          conversation={item}
          currentUserId={currentUserId || ''}
          onPress={() => handlePress(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  )
}

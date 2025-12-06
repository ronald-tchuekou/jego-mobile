import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { Message } from '@/src/services/chat-service'
import { FlatList } from 'react-native'
import useGetMessages from '../hooks/use-get-messages'
import MessageItem from './message-item'
import { useAuthStore } from '@/src/stores/auth-store'
import { useEffect, useRef } from 'react'

type Props = {
  conversationId: string
}

export default function MessagesList({ conversationId }: Props) {
  const { isLoading, data } = useGetMessages(conversationId)
  const auth = useAuthStore((state) => state.auth)
  const currentUserId = auth?.user?.id
  const flatListRef = useRef<FlatList>(null)

  const isMyMessage = (message: Message) => {
    return message.senderId === currentUserId
  }

  // Scroll to bottom when messages load or conversation changes
  useEffect(() => {
    if (data && data.length > 0 && !isLoading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false })
      }, 100)
    }
  }, [data, isLoading, conversationId])

  return (
    <FlatList
      ref={flatListRef}
      className='flex-1'
      contentContainerClassName='p-4'
      data={data || []}
      ListEmptyComponent={
        isLoading ? (
          <LoaderContent />
        ) : (
          <EmptyContent text={'Aucun message pour le moment.'} />
        )
      }
      renderItem={({ item }) => (
        <MessageItem message={item} isMyMessage={isMyMessage(item)} />
      )}
      keyExtractor={(item) => item.id}
      inverted={false}
      onContentSizeChange={() => {
        if (data && data.length > 0) {
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      }}
    />
  )
}


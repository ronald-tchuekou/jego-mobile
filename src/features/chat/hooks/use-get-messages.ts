import { chatKey } from '@/src/lib/query-kye'
import ChatService from '@/src/services/chat-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useQuery } from '@tanstack/react-query'

const useGetMessages = (conversationId: string | null) => {
  const auth = useAuthStore((state) => state.auth)

  const { isLoading, data } = useQuery({
    queryKey: chatKey.list({ label: 'messages', conversationId }),
    async queryFn() {
      if (!conversationId || !auth?.token) return undefined
      return ChatService.getConversationMessages(conversationId, auth.token)
    },
    enabled: !!conversationId && !!auth?.token,
  })
  const messages = [...(data?.data || [])].reverse()
  return { isLoading, data: messages }
}

export default useGetMessages

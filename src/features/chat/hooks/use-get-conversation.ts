import { chatKey } from '@/src/lib/query-kye'
import ChatService from '@/src/services/chat-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useQuery } from '@tanstack/react-query'

const useGetConversation = (conversationId: string | null) => {
  const auth = useAuthStore((state) => state.auth)

  const { isLoading, data } = useQuery({
    queryKey: chatKey.detail(conversationId || ''),
    async queryFn() {
      if (!conversationId || !auth?.token) return null
      return ChatService.getConversation(conversationId, auth.token)
    },
    enabled: !!conversationId && !!auth?.token,
  })

  return { isLoading, data }
}

export default useGetConversation


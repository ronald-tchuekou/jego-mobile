import { chatKey } from '@/src/lib/query-kye'
import ChatService from '@/src/services/chat-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useQuery } from '@tanstack/react-query'

const useGetContacts = () => {
  const auth = useAuthStore((state) => state.auth)

  const { isLoading, data } = useQuery({
    queryKey: chatKey.list({ label: 'contacts' }),
    async queryFn() {
      if (!auth?.token) return []
      return ChatService.getConversations(auth.token)
    },
    enabled: !!auth?.token,
  })

  return { isLoading, data }
}

export default useGetContacts

import { chatKey } from '@/src/lib/query-kye'
import ChatService from '@/src/services/chat-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useQuery } from '@tanstack/react-query'
import usePusherSubscribe from '@/src/hooks/use-pusher-subscribe'

const useGetContacts = () => {
  const auth = useAuthStore((state) => state.auth)

  const { isLoading, data, refetch, isRefetching } = useQuery({
    queryKey: chatKey.list({ label: 'contacts' }),
    async queryFn() {
      if (!auth?.token) return []
      return ChatService.getConversations(auth.token)
    },
    enabled: !!auth?.token,
  })

  usePusherSubscribe('new_message', refetch)

  return { isLoading, data, refetch, isRefetching }
}

export default useGetContacts

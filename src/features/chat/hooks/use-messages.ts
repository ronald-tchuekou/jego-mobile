import { chatKey } from '@/src/lib/query-kye'
import ChatService, { MessageType } from '@/src/services/chat-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IMessage } from 'react-native-gifted-chat'
import { getFullUrl } from '@/src/lib/utils'
import { IMAGES } from '@/src/lib/images'
import Toast from 'react-native-toast-message'

const useMessages = (conversationId: string | null) => {
  const auth = useAuthStore((state) => state.auth)
  const queryClient = useQueryClient()

  // Get messages from the API
  const { isLoading, data, refetch } = useQuery({
    queryKey: chatKey.list({ label: 'messages', conversationId }),
    async queryFn() {
      if (!conversationId || !auth?.token) return undefined
      return ChatService.getConversationMessages(conversationId, auth.token)
    },
  })

  // Store message to the API
  const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
    mutationFn: async (text: string) => {
      if (!conversationId) throw new Error('Conversation ID is required')
      if (!auth?.token) throw new Error('Token is required')

      return ChatService.sendMessage(
        {
          conversationId,
          content: text.trim(),
          type: MessageType.TEXT,
        },
        auth.token,
      )
    },
    onSuccess() {
      refetch().then()
      queryClient.invalidateQueries({ queryKey: chatKey.all }).then()
    },
    onError(error) {
      Toast.show({
        text1: 'Oops !',
        text2: 'Une erreur est survenue, veuillez reprendre.',
        type: 'error',
      })
      console.error('Failed to send message:', error)
    },
  })

  const formatedMessages = [...(data?.data || [])].map(
    (message) =>
      ({
        _id: message.id,
        text: message.content || '',
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.sender.id,
          name: `${message.sender.firstName} ${message.sender.lastName}`.trim(),
          avatar: message.sender.profileImage ? getFullUrl(message.sender.profileImage) : IMAGES.default_user_avatar,
        },
      }) as IMessage,
  )

  return { isLoading, messages: formatedMessages, sendMessage, isSendingMessage }
}

export default useMessages

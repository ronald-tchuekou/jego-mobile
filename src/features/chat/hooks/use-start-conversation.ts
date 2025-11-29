import { chatKey } from '@/src/lib/query-kye'
import ChatService from '@/src/services/chat-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'

const useStartConversation = () => {
  const auth = useAuthStore((state) => state.auth)
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async ({ participantId }: { participantId: string }) => {
      if (!auth?.token) throw new Error('Not authenticated')

      const conversation = await ChatService.createConversation(
        {
          participantIds: [participantId],
        },
        auth.token,
      )

      return conversation
    },
    onSuccess: (conversation) => {
      if (conversation) {
        // Invalidate conversations list to show the updated/new one
        queryClient.invalidateQueries({
          queryKey: chatKey.list({ label: 'contacts' }),
        })

        // Navigate to the chat page with the conversation
        router.push({
          pathname: '/chat/[conversation_id]',
          params: {
            conversation_id: `${conversation.id}`,
          },
        })
      }
    },
    onError: (error) => {
      console.error('Failed to start conversation:', error)
      Toast.show({
        text1: 'Une erreur est survenue',
        text2: 'Impossible de démarrer la conversation',
        type: 'error',
        visibilityTime: 6000,
      })
    },
  })

  return {
    startConversation: mutation.mutate,
    isStarting: mutation.isPending,
    error: mutation.error,
  }
}

export default useStartConversation

import { Button, ButtonIcon } from '@/src/components/ui/button'
import { HStack } from '@/src/components/ui/hstack'
import { Input, InputField } from '@/src/components/ui/input'
import { Send } from 'lucide-react-native'
import { useState } from 'react'
import ChatService, { MessageType } from '@/src/services/chat-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useQueryClient } from '@tanstack/react-query'
import { chatKey } from '@/src/lib/query-kye'
import { View } from 'react-native'

type Props = {
  conversationId: string
}

export default function MessageInput({ conversationId }: Props) {
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const auth = useAuthStore((state) => state.auth)
  const queryClient = useQueryClient()

  const sendMessage = async () => {
    if (!messageText.trim() || !conversationId || !auth?.token || isSending) return

    setIsSending(true)
    try {
      await ChatService.sendMessage(
        {
          conversationId,
          content: messageText,
          type: MessageType.TEXT,
        },
        auth.token
      )

      setMessageText('')

      // Invalidate and refetch messages
      await queryClient.invalidateQueries({
        queryKey: chatKey.list({ label: 'messages', conversationId }),
      })

      // Also invalidate conversations to update last message
      await queryClient.invalidateQueries({
        queryKey: chatKey.list({ label: 'contacts' }),
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <View className='border-t border-jego-border p-4 bg-jego-card'>
      <HStack className='items-center gap-2' space='sm'>
        <Input className='flex-1'>
          <InputField
            placeholder='Tapez votre message...'
            value={messageText}
            onChangeText={setMessageText}
            multiline
            editable={!isSending}
            onSubmitEditing={sendMessage}
            returnKeyType='send'
          />
        </Input>
        <Button
          onPress={sendMessage}
          disabled={!messageText.trim() || isSending}
          size='md'
          className='rounded-full'
        >
          <ButtonIcon as={Send} size='md' />
        </Button>
      </HStack>
    </View>
  )
}


import { Button, ButtonIcon } from '@/src/components/ui/button'
import { Spinner } from '@/src/components/ui/spinner'
import { UserModel } from '@/src/services/auth-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { MessageCircleMoreIcon } from 'lucide-react-native'
import { memo } from 'react'
import { Alert } from 'react-native'
import { cnBase } from 'tailwind-variants'
import useStartConversation from '../../chat/hooks/use-start-conversation'

type Props = {
  companyUsers: UserModel[]
  className?: string
}

const ChatButton = ({ companyUsers, className }: Props) => {
  const auth = useAuthStore((state) => state.auth)
  const { startConversation, isStarting, error } = useStartConversation()

  const companyAdmin =
    companyUsers.find((user) => user.role === 'company:admin' && user.companyId) ||
    companyUsers.find((user) => user.role === 'company:agent' && user.companyId)

  if (!auth?.user || !companyUsers?.length || !companyAdmin || companyAdmin.id === auth.user.id) {
    return null
  }

  const handleStartChat = () => {
    try {
      startConversation({ participantId: companyAdmin.id })
    } catch (error) {
      console.error('Error starting chat:', error)
      Alert.alert('Impossible de démarrer la conversation')
    }
  }

  if (error) {
    Alert.alert("Erreur lors de l'ouverture de la conversation")
  }

  return (
    <Button
      onPress={handleStartChat}
      disabled={isStarting || !companyAdmin}
      variant='outline'
      className={cnBase('rounded-xl bg-jego-background border-jego-border size-9', className)}
    >
      {isStarting ? <Spinner /> : <ButtonIcon as={MessageCircleMoreIcon} size='lg' className='text-jego-foreground' />}
    </Button>
  )
}

export default memo(ChatButton)

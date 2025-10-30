import { Button, ButtonSpinner, ButtonText } from '@/src/components/ui/button'
import AuthService from '@/src/services/auth-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { useShallow } from 'zustand/shallow'

export const LogoutButton = () => {
  const { logout, token } = useAuthStore(useShallow((s) => ({ logout: s.logout, token: s.auth?.token })))
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: async (token: string) => {
      return AuthService.logout(token)
    },
    onSuccess: () => {
      logout()
      router.replace('/login')
    },
    onError: (error) => {
      console.error(error)
      Alert.alert(error.message)
    },
  })

  return (
    <Button
      disabled={isPending}
      variant='outline'
      onPress={() => mutate(token || '')}
      className='rounded-lg border-jego-destructive'
    >
      {isPending && <ButtonSpinner className='text-jego-destructive' />}
      <ButtonText className='text-jego-destructive'>Déconnexion</ButtonText>
    </Button>
  )
}

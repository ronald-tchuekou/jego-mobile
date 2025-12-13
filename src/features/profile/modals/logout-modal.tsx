import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/src/components/ui/alert-dialog'
import { Button, ButtonText } from '@/src/components/ui/button'
import { Spinner } from '@/src/components/ui/spinner'
import { checkUserNowAccess } from '@/src/lib/utils'
import AuthService from '@/src/services/auth-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useMutation } from '@tanstack/react-query'
import { useImperativeHandle, useState } from 'react'
import { Text } from 'react-native'
import Toast from 'react-native-toast-message'
import { useShallow } from 'zustand/shallow'

export type LogoutModalRef = {
  open: VoidFunction
}

type Props = {
  ref: React.Ref<LogoutModalRef>
}

export const LogoutModal = ({ ref }: Props) => {
  const [open, setOpen] = useState(false)
  const { auth, logout } = useAuthStore(
    useShallow((state) => ({
      auth: state.auth,
      logout: state.logout,
    })),
  )

  const { mutate: doLogout, isPending: loggingOut } = useMutation({
    mutationFn: async (token: string) => {
      return AuthService.logout(token)
    },
    onSuccess: () => {
      setOpen(false)
      logout()
    },
    onError: (error) => {
      const noAccess = checkUserNowAccess(error.message)
      if (noAccess) {
        setOpen(false)
        logout()
      } else {
        Toast.show({
          text1: 'Une erreur est survenue lors de la déconnexion',
          type: 'error',
        })
      }
    },
  })

  useImperativeHandle(ref, () => ({
    open() {
      setOpen(true)
    },
  }))

  return (
    <AlertDialog isOpen={open} onClose={() => {}}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader className='justify-center'>
          <Text className='text-lg font-bold text-foreground text-center'>Confirmer la déconnexion</Text>
        </AlertDialogHeader>
        <AlertDialogBody className=''>
          <Text className='text-base text-center text-muted-foreground'>
            Êtes-vous sûr de vouloir vous déconnecter ?
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            isDisabled={loggingOut}
            className='flex-1 rounded-full border-border'
            variant='outline'
            onPress={() => setOpen(false)}
          >
            <ButtonText className='text-foreground'>NON</ButtonText>
          </Button>
          <Button
            isDisabled={loggingOut}
            className='flex-1 rounded-full bg-primary'
            variant='solid'
            onPress={() => {
              if (auth?.token) {
                doLogout(auth.token)
              } else {
                Toast.show({
                  text1: "Vous n'êtes pas connecté",
                  type: 'error',
                })
              }
            }}
          >
            {loggingOut && <Spinner className='text-primary-foreground' />}
            {!loggingOut && <ButtonText className='text-primary-foreground'>OUI</ButtonText>}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

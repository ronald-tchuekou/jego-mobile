import {
   AlertDialog,
   AlertDialogBackdrop,
   AlertDialogBody,
   AlertDialogContent,
   AlertDialogFooter,
   AlertDialogHeader,
} from '@/src/components/ui/alert-dialog'
import { Button, ButtonText } from '@/src/components/ui/button'
import AuthService from '@/src/services/auth-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useMutation } from '@tanstack/react-query'
import { useImperativeHandle, useState } from 'react'
import { Text } from 'react-native'
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
    mutationFn: async () => {
      if (auth?.token) {
        await AuthService.logout(auth.token)
      }
    },
    onSuccess: () => {
      setOpen(false)
      logout()
    },
  })

  useImperativeHandle(ref, () => ({
    open() {
      setOpen(true)
    },
  }))

  return (
    <AlertDialog isOpen={open} onClose={() => {}}>
      <AlertDialogBackdrop className='bg-black/50' />
      <AlertDialogContent className='bg-jego-card'>
        <AlertDialogHeader className='justify-center'>
          <Text className='text-lg font-bold text-jego-foreground text-center'>Confirmer la déconnexion</Text>
        </AlertDialogHeader>
        <AlertDialogBody className=''>
          <Text className='text-base text-center text-jego-muted-foreground'>
            Êtes-vous sûr de vouloir vous déconnecter ?
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            disabled={loggingOut}
            className='flex-1 rounded-full border-jego-border'
            variant='outline'
            onPress={() => setOpen(false)}
          >
            <ButtonText className='text-jego-muted-foreground'>NON</ButtonText>
          </Button>
          <Button disabled={loggingOut} className='flex-1 rounded-full' variant='solid' onPress={() => doLogout()}>
            <ButtonText className='text-jego-primary-foreground'>
              OUI
            </ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

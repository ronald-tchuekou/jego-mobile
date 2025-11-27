import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/src/components/ui/alert-dialog'
import { Card } from '@/src/components/ui/card'
import { Icon } from '@/src/components/ui/icon'
import { VStack } from '@/src/components/ui/vstack'
import { ProfileImage } from '@/src/features/profile/components/profile-image'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import AuthService from '@/src/services/auth-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { IconLockFilled, IconLogout, IconTrash } from '@tabler/icons-react-native'
import { useMutation } from '@tanstack/react-query'
import Constants from 'expo-constants'
import { useRouter } from 'expo-router'
import { MailIcon, UserIcon } from 'lucide-react-native'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { cnBase } from 'tailwind-variants'

const AD = AlertDialog as any
const ADBackdrop = AlertDialogBackdrop as any
const ADContent = AlertDialogContent as any
const ADHeader = AlertDialogHeader as any
const ADBody = AlertDialogBody as any
const ADFooter = AlertDialogFooter as any

export default function ProfileScreen() {
  const height = getStatusBarHeight()
  const router = useRouter()
  const auth = useAuthStore((s) => s.auth)
  const logout = useAuthStore((s) => s.logout)
  const [showLogoutModal, setShowLogoutModal] = React.useState(false)

  const { mutate: doLogout, isPending: loggingOut } = useMutation({
    mutationFn: async () => {
      if (auth?.token) {
        await AuthService.logout(auth.token)
      }
    },
    onSuccess: () => {
      logout()
      setShowLogoutModal(false)
      router.replace('/login')
    },
  })

  return (
    <VStack className='flex-1 bg-jego-background'>
      <VStack
        className='px-4 pb-4 bg-jego-card border-b border-jego-border'
        space='md'
        style={{ paddingTop: height + 10 }}
      >
        <Text className='text-3xl font-bold text-jego-card-foreground'>Gestion du compte</Text>
      </VStack>
      <ScrollView className='p-4'>
        <ProfileImage />
        {/* Action list */}
        <Card className='mt-5 p-0'>
          <ActionItem icon={UserIcon} title='Informations personnelles' onPress={() => router.push('/profile/update-info')} />
          <View className='h-[1px] bg-jego-border' />
          <ActionItem icon={MailIcon} title='Adresse email' onPress={() => router.push('/profile/update-email')} />
          <View className='h-[1px] bg-jego-border' />
          <ActionItem icon={IconLockFilled} title='Mot de passe' onPress={() => router.push('/profile/update-password')} />
          <View className='h-[1px] bg-jego-border' />
          <ActionItem icon={IconLogout} title='Déconnexion' onPress={() => setShowLogoutModal(true)} />
        </Card>
        <Text className='text-base font-medium text-jego-foreground mt-5'>Zone dangereuse</Text>
        <Card className='mt-3 p-0'>
          <ActionItem destructive icon={IconTrash} title='Supprimer le compte' onPress={() => {}} />
        </Card>
        <View className='h-5' />
        <Text className='text-sm text-jego-muted-foreground text-center'>{`Version ${Constants.expoConfig?.version}`}</Text>
        <Text className='text-sm text-jego-muted-foreground text-center'>
          © {new Date().getFullYear()} Jego. Tous droits réservés.
        </Text>
        <View className='h-12' />
      </ScrollView>
      <AD isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <ADBackdrop />
        <ADContent className="bg-jego-card">
          <ADHeader>
            <Text className='text-lg font-bold text-jego-foreground'>Confirmer la déconnexion</Text>
          </ADHeader>
          <ADBody>
            <Text className='text-sm text-jego-muted-foreground'>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </Text>
          </ADBody>
          <ADFooter>
            <TouchableOpacity
              disabled={loggingOut}
              className='h-10 px-4 rounded-lg border border-jego-border justify-center items-center'
              onPress={() => setShowLogoutModal(false)}
              activeOpacity={0.7}
            >
              <Text className='text-jego-foreground'>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={loggingOut}
              className='h-10 px-4 rounded-lg bg-jego-destructive justify-center items-center'
              onPress={() => doLogout()}
              activeOpacity={0.7}
            >
              <Text className='text-jego-destructive-foreground'>{loggingOut ? 'Déconnexion...' : 'Se déconnecter'}</Text>
            </TouchableOpacity>
          </ADFooter>
        </ADContent>
      </AD>
    </VStack>
  )
}

type Props = {
  icon: React.ElementType<any, keyof React.JSX.IntrinsicElements>
  title: string
  destructive?: boolean
  onPress: () => void
}

const ActionItem = ({ icon, title, destructive, onPress }: Props) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} className={cnBase('flex-row h-14 items-center gap-3 px-4')}>
      <Icon as={icon} size='xl' className={cnBase(destructive ? 'text-jego-destructive' : 'text-jego-foreground')} />
      <Text className={cnBase('text-base font-medium', destructive ? 'text-jego-destructive' : 'text-jego-foreground')}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

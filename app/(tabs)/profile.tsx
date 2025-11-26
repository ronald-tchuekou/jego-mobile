import { Card } from '@/src/components/ui/card'
import { Icon } from '@/src/components/ui/icon'
import { VStack } from '@/src/components/ui/vstack'
import { ProfileImage } from '@/src/features/profile/components/profile-image'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { IconLockFilled, IconLogout, IconTrash } from '@tabler/icons-react-native'
import Constants from 'expo-constants'
import { MailIcon, UserIcon } from 'lucide-react-native'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { cnBase } from 'tailwind-variants'

export default function ProfileScreen() {
  const height = getStatusBarHeight()

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
          <ActionItem icon={UserIcon} title='Informations personnelles' onPress={() => {}} />
          <View className='h-[1px] bg-jego-border' />
          <ActionItem icon={MailIcon} title='Adresse email' onPress={() => {}} />
          <View className='h-[1px] bg-jego-border' />
          <ActionItem icon={IconLockFilled} title='Mot de passe' onPress={() => {}} />
          <View className='h-[1px] bg-jego-border' />
          <ActionItem icon={IconLogout} title='Déconnexion' onPress={() => {}} />
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

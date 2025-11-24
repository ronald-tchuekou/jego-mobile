import { BackButton } from '@/src/components/base/back-button'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { IMAGES } from '@/src/lib/images'
import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'

export default function ConversationScreen() {
  const { company_id } = useLocalSearchParams<{ company_id: string }>()
  const height = getStatusBarHeight()

  console.log('Company Id: ', company_id)

  return (
    <View className='flex-1 bg-jego-background'>
      <HStack space='md' className='p-4 bg-jego-card border-b border-jego-border' style={{ paddingTop: height + 10 }}>
        <BackButton />
        <Avatar size='md'>
          <AvatarImage source={IMAGES.default_user_avatar} />
        </Avatar>
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-jego-foreground' numberOfLines={1}>
            {'John Doe'}
          </Text>
          <Text className='text-sm text-jego-primary'>{'johndoe@gmail.com'}</Text>
        </VStack>
      </HStack>
    </View>
  )
}

import { BackButton } from '@/src/components/base/back-button'
import { HStack } from '@/src/components/ui/hstack'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { useLocalSearchParams } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'

export default function EditAppointmentScreen() {
  const { company_id } = useLocalSearchParams<{ company_id: string }>()
  const height = getStatusBarHeight()

  console.log('Company Id: ', company_id)

  return (
    <View className='flex-1 bg-jego-background'>
      <HStack
        space='md'
        className='p-4 bg-jego-card border-b border-jego-border items-center'
        style={{ paddingTop: height + 10 }}
      >
        <BackButton />
        <Text className='font-semibold text-xl text-jego-foreground' numberOfLines={1}>
          Prendre rendez-vous
        </Text>
      </HStack>
      <ScrollView className='flex-1 p-3'>
        <Text>Hello</Text>
      </ScrollView>
    </View>
  )
}

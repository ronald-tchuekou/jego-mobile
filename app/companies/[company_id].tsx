import { VStack } from '@/src/components/ui/vstack'
import { Text } from 'react-native'

export default function PostDetailsScreen() {
  return (
    <VStack className='flex-1 bg-jego-background'>
      <Text className='text-3xl font-bold text-jego-card-foreground'>Details du post</Text>
    </VStack>
  )
}

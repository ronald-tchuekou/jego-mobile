import { SearchInput } from '@/src/components/base/search-input'
import { VStack } from '@/src/components/ui/vstack'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { useState } from 'react'
import { Text, View } from 'react-native'

export default function JobsScreen() {
  const height = getStatusBarHeight()
  const [search, setSearch] = useState('')

  return (
    <View className='flex-1 bg-jego-background'>
      <VStack className='p-4 bg-jego-card border-b border-jego-border' space='md' style={{ paddingTop: height + 10 }}>
        <Text className='text-3xl font-bold text-jego-card-foreground'>Offres d&apos;emploi</Text>
        <SearchInput placeholder='Rechercher un poste...' onChangeText={setSearch} />
      </VStack>
    </View>
  )
}

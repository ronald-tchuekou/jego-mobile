import { SearchInput } from '@/src/components/base/search-input'
import { VStack } from '@/src/components/ui/vstack'
import PostsList from '@/src/features/posts/components/posts-list'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { useState } from 'react'
import { Text } from 'react-native'

export default function Index() {
  const [search, setSearch] = useState('')
  const height = getStatusBarHeight()

  return (
    <VStack className='flex-1 bg-jego-background'>
      <VStack className='p-4 bg-jego-card border-b border-jego-border' space='md' style={{ paddingTop: height + 10 }}>
        <Text className='text-3xl font-bold text-jego-card-foreground'>Annonces</Text>
        <SearchInput placeholder='Rechercher...' onChangeText={setSearch} />
      </VStack>
      <PostsList search={search} />
    </VStack>
  )
}

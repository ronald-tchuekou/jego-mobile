import { SearchInput } from '@/src/components/base/search-input'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { HeaderContainer } from '@/src/components/base/header-container'
import PostsList from '@/src/features/posts/components/posts-list'

export default function Index() {
  const [search, setSearch] = useState('')

  return (
    <View className='flex-1 bg-background'>
      <HeaderContainer>
        <Text className='text-3xl font-bold text-card-foreground'>Annonces</Text>
        <SearchInput placeholder='Rechercher...' onChangeText={setSearch} />
      </HeaderContainer>
      <PostsList search={search} />
    </View>
  )
}

import { SearchInput } from '@/src/components/base/search-input'
import PostsList from '@/src/features/posts/components/posts-list'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { HeaderContainer } from '@/src/components/base/header-container'

export default function Index() {
  const [search, setSearch] = useState('')

  return (
    <View className='flex-1 bg-jego-background'>
      <HeaderContainer>
        <Text className='text-3xl font-bold text-jego-card-foreground'>Annonces</Text>
        <SearchInput placeholder='Rechercher...' onChangeText={setSearch} />
      </HeaderContainer>
      <PostsList search={search} />
    </View>
  )
}

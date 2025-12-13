import { SearchInput } from '@/src/components/base/search-input'
import { useState } from 'react'
import { Text, View } from 'react-native'
import ConversationsList from '@/src/features/chat/components/conversations-list'
import { HeaderContainer } from '@/src/components/base/header-container'

export default function ChatScreen() {
  const [search, setSearch] = useState('')

  return (
    <View className='flex-1 bg-background'>
      <HeaderContainer>
        <Text className='text-3xl font-bold text-card-foreground'>Messages</Text>
        <SearchInput placeholder='Rechercher un contact...' onChangeText={setSearch} />
      </HeaderContainer>
      <ConversationsList search={search} />
    </View>
  )
}

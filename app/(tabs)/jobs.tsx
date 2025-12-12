import { SearchInput } from '@/src/components/base/search-input'
import JobsList from '@/src/features/jobs/components/jobs-list'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { HeaderContainer } from '@/src/components/base/header-container'

export default function JobsScreen() {
  const [search, setSearch] = useState('')

  return (
    <View className='flex-1 bg-jego-background'>
      <HeaderContainer>
        <Text className='text-3xl font-bold text-jego-card-foreground'>Offres d&apos;emploi</Text>
        <SearchInput placeholder='Rechercher une job...' onChangeText={setSearch} />
      </HeaderContainer>
      <JobsList search={search} />
    </View>
  )
}

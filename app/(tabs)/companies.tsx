import { SearchInput } from '@/src/components/base/search-input'
import { Button, ButtonIcon } from '@/src/components/ui/button'
import { HStack } from '@/src/components/ui/hstack'
import ListCompanies from '@/src/features/companies/components/list-companies'
import { globalStyles } from '@/src/lib/global-styles'
import { FilterIcon } from 'lucide-react-native'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { HeaderContainer } from '@/src/components/base/header-container'

export default function CompaniesScreen() {
  const [search, setSearch] = useState('')

  return (
    <View className='flex-1 bg-background'>
      <HeaderContainer>
        <Text className='text-3xl font-bold text-card-foreground'>Entreprises</Text>
        <HStack className='gap-2'>
          <SearchInput className='flex-1' placeholder='Rechercher une entreprise...' onChangeText={setSearch} />
          <Button
            variant='outline'
            size='lg'
            action='secondary'
            className='p-0 rounded-full'
            style={globalStyles.button_icon.lg}
          >
            <ButtonIcon as={FilterIcon} size='lg' />
          </Button>
        </HStack>
      </HeaderContainer>
      <ListCompanies search={search} />
    </View>
  )
}

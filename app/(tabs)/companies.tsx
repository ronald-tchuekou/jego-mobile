import { SearchInput } from '@/src/components/base/search-input'
import { Button, ButtonIcon } from '@/src/components/ui/button'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import ListCompanies from '@/src/features/companies/components/list-companies'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { globalStyles } from '@/src/lib/global-styles'
import { FilterIcon } from 'lucide-react-native'
import { useState } from 'react'
import { Text } from 'react-native'

export default function CompaniesScreen() {
  const height = getStatusBarHeight()
  const [search, setSearch] = useState('')

  return (
    <VStack className='flex-1 bg-jego-background'>
      <VStack className='p-4 bg-jego-card border-b border-jego-border' space='md' style={{ paddingTop: height + 10 }}>
        <Text className='text-3xl font-bold text-jego-card-foreground'>Entreprises</Text>
        <HStack className='gap-2'>
          <SearchInput
            className='flex-1'
            placeholder='Rechercher une entreprise...'
            onChangeText={setSearch}
          />
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
      </VStack>
      <ListCompanies search={search} />
    </VStack>
  )
}

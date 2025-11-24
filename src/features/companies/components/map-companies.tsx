import { Center } from '@/src/components/ui/center'
import { memo } from 'react'
import { Text } from 'react-native'

const MapCompaniesComponent = () => {
  return (
    <Center>
      <Text>Companies map view</Text>
    </Center>
  )
}

export const MapCompanies = memo(MapCompaniesComponent)

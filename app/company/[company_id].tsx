import { BackButton } from '@/src/components/base/back-button'
import { Center } from '@/src/components/ui/center'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { Spinner } from '@/src/components/ui/spinner'
import { VStack } from '@/src/components/ui/vstack'
import { CompanyDetailsCard } from '@/src/features/companies/components/company-details-card'
import { CompanyTabs } from '@/src/features/companies/components/company-details-tabs/company-tabs'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { companyKey } from '@/src/lib/query-kye'
import CompanyService from '@/src/services/company-service'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { CircleSlash2Icon } from 'lucide-react-native'
import { ScrollView, Text, View } from 'react-native'

export default function PostDetailsScreen() {
  const { company_id } = useLocalSearchParams<{ company_id: string }>()
  const height = getStatusBarHeight()

  const { data, isLoading } = useQuery({
    queryKey: companyKey.detail(company_id),
    async queryFn({ queryKey }) {
      const companyId = queryKey[2]
      const result = await CompanyService.getById(companyId)
      return result || undefined
    },
  })

  return (
    <View className='flex-1 bg-jego-background'>
      <HStack space='md' className='p-4 bg-jego-card border-b border-jego-border' style={{ paddingTop: height + 10 }}>
        <BackButton />
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-jego-foreground' numberOfLines={1}>
            {data?.name || '- - -'}
          </Text>
          <Text className='text-sm text-jego-primary'>{data?.category?.name || '- - -'}</Text>
        </VStack>
      </HStack>
      <ScrollView className='flex-1 p-4'>
        {isLoading ? (
          <Center className='min-h-32'>
            <Spinner size={'large'} />
          </Center>
        ) : !data ? (
          <Center className='w-full min-h-80'>
            <VStack className='p-3 items-center' space='md'>
              <Icon as={CircleSlash2Icon} className='text-jego-muted-foreground' style={{ width: 40, height: 40 }} />
              <Text className='text-base text-jego-muted-foreground'>Annonce non trouvé.</Text>
            </VStack>
          </Center>
        ) : (
          <>
            <CompanyDetailsCard company={data} />
            <CompanyTabs company={data} />
          </>
        )}
      </ScrollView>
    </View>
  )
}

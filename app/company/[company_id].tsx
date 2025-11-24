import { BackButton } from '@/src/components/base/back-button'
import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import { CompanyDetailsCard } from '@/src/features/companies/components/company-details-card'
import { CompanyTabs } from '@/src/features/companies/components/company-details-tabs/company-tabs'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { companyKey } from '@/src/lib/query-kye'
import CompanyService from '@/src/services/company-service'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
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
          <LoaderContent/>
        ) : !data ? (
          <EmptyContent text={'Cette entreprise n\'existe pas.'} />
        ) : (
          <>
            <CompanyDetailsCard company={data} />
            <CompanyTabs company={data} />
          </>
        )}
        <View className='h-20'/>
      </ScrollView>
    </View>
  )
}

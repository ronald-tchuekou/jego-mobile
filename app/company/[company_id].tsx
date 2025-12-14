import { BackButton } from '@/src/components/base/back-button'
import EmptyContent from '@/src/components/base/empty-content'
import { HeaderContainer } from '@/src/components/base/header-container'
import { LoaderContent } from '@/src/components/base/loader-content'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import { CompanyDetailsCard } from '@/src/features/companies/components/company-details-card'
import { CompanyTabs } from '@/src/features/companies/components/company-details-tabs/company-tabs'
import { companyKey } from '@/src/lib/query-kye'
import CompanyService from '@/src/services/company-service'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'

export default function PostDetailsScreen() {
  const { company_id } = useLocalSearchParams<{ company_id: string }>()

  const { data, isLoading } = useQuery({
    queryKey: companyKey.detail(company_id),
    async queryFn({ queryKey }) {
      const companyId = queryKey[2]
      const result = await CompanyService.getById(companyId)
      return result || undefined
    },
  })

  return (
    <View className='flex-1 bg-background'>
      <HeaderContainer>
        <HStack space='md'>
          <BackButton />
          <VStack className='flex-1'>
            <Text className='font-semibold text-base text-foreground' numberOfLines={1}>
              {data?.name || '- - -'}
            </Text>
            <Text className='text-sm text-primary'>{data?.category?.name || '- - -'}</Text>
          </VStack>
        </HStack>
      </HeaderContainer>

      <ScrollView className='flex-1'>
        <View className={'px-4 py-10'}>
          {isLoading ? (
            <LoaderContent />
          ) : !data ? (
            <EmptyContent text={"Cette entreprise n'existe pas."} />
          ) : (
            <>
              <CompanyDetailsCard company={data} />
              <CompanyTabs company={data} />
            </>
          )}
          <View className='h-20' />
        </View>
      </ScrollView>
    </View>
  )
}

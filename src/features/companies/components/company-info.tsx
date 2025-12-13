import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { Spinner } from '@/src/components/ui/spinner'
import { companyKey } from '@/src/lib/query-kye'
import { getCompanyLogoUri } from '@/src/lib/utils'
import CompanyService from '@/src/services/company-service'
import { useQuery } from '@tanstack/react-query'
import { Text, View } from 'react-native'

type Props = {
  companyId: string
}

export const CompanyInfo = ({ companyId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: companyKey.detail(companyId),
    async queryFn({ queryKey }) {
      const companyId = queryKey[2]
      const result = await CompanyService.getById(companyId)
      return result || undefined
    },
  })

  const companyLogo = getCompanyLogoUri(data?.logo)

  return (
    <Card className='relative'>
      <HStack space='lg' className='items-center'>
        <Avatar size='md' className='size-12 flex-none'>
          <AvatarImage source={companyLogo} alt={data?.name || 'Company logo'} />
        </Avatar>
        <View className='flex-1'>
          <Text className='font-medium text-lg text-foreground'>{data?.name || '- - - -'} </Text>
          <Text className='text-xs text-primary'>{data?.category?.name || '- - - -'}</Text>
        </View>
      </HStack>
      {isLoading && (
        <View className='absolute top-0 bottom-0 left-0 right-0 bg-background flex justify-center items-center'>
          <Spinner size={'small'} className='text-primary' />
        </View>
      )}
    </Card>
  )
}

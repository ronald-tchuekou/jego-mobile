import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { VStack } from '@/src/components/ui/vstack'
import { getCompanyLogoUri } from '@/src/lib/utils'
import { CompanyModel } from '@/src/services/company-service'
import { IconMapPinFilled, IconPhoneFilled } from '@tabler/icons-react-native'
import { Link } from 'expo-router'
import { MailIcon } from 'lucide-react-native'
import { Text } from 'react-native'
import { CompanyImageBanner } from './company-image-banner'

type Props = {
  company: CompanyModel
}

const CompanyItem = ({ company }: Props) => {
  const companyLogo = getCompanyLogoUri(company.logo)
  
  return (
    <Link href={`/company/${company.id}`}>
      <Card className='p-0 border border-jego-border'>
        <CompanyImageBanner company={company} className={'rounded-t-lg'} />
        <HStack className='p-3 gap-3'>
          <Avatar size='md' className='size-12 flex-none'>
            <AvatarImage source={companyLogo} alt={company.name} />
          </Avatar>
          <VStack className='flex-1'>
            <Text className='font-medium text-lg text-jego-foreground'>{company.name} </Text>
            {company.category?.name && <Text className='text-xs text-jego-primary'>{company.category?.name}</Text>}
            <HStack className='items-start gap-1.5 mt-2'>
              <Icon as={MailIcon} size='lg' className='text-jego-muted-foreground' />
              <Text className='text-sm flex-1 text-jego-muted-foreground'>{company.email || '- - -'}</Text>
            </HStack>
            <HStack className='items-start gap-1.5 mt-1'>
              <Icon as={IconPhoneFilled} size='lg' className='text-jego-muted-foreground' />
              <Text className='text-sm flex-1 text-jego-muted-foreground'>{company.phone || '- - -'}</Text>
            </HStack>
            <HStack className='items-start gap-1.5 mt-1'>
              <Icon as={IconMapPinFilled} size='lg' className='text-jego-muted-foreground' />
              <Text className='text-sm flex-1 text-jego-muted-foreground'>{company.address || '- - -'}</Text>
            </HStack>
          </VStack>
        </HStack>
      </Card>
    </Link>
  )
}

export default CompanyItem

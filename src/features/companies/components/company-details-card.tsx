import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Button, ButtonText } from '@/src/components/ui/button'
import { Card } from '@/src/components/ui/card'
import { Center } from '@/src/components/ui/center'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { compactNumber, getCompanyLogoUri, pluralize } from '@/src/lib/utils'
import { CompanyModel } from '@/src/services/company-service'
import { IconMapPinFilled, IconPhoneFilled } from '@tabler/icons-react-native'
import { Link } from 'expo-router'
import { MailIcon } from 'lucide-react-native'
import { memo } from 'react'
import { Text, View } from 'react-native'
import ChatButton from './chat-button'
import CompanyRatingAverage from './company-details-tabs/company-rating-average'
import CompanyFollowButtonToggle from './company-follow-button-toggle'
import { CompanyImageBanner } from './company-image-banner'
import SocialLinks from './social-links'

type Props = {
  company: CompanyModel
}

const CompanyDetailsCardComponent = ({ company }: Props) => {
  const companyLogo = getCompanyLogoUri(company.logo)
  const followersCount = company.followingCount || 0

  return (
    <Card className='p-0'>
      <CompanyImageBanner company={company} className={'rounded-t-lg'} />
      <Center className='px-4 pt-8 gap-2'>
        <Avatar size='xl' className='flex-none'>
          <AvatarImage source={companyLogo} alt={company.name} className='' />
        </Avatar>
        <Text className='text-xl font-bold text-jego-foreground'>{company.name}</Text>
        {company.category?.name && <Text className='text-sm text-jego-primary'>{company.category?.name}</Text>}
        <CompanyRatingAverage companyId={company.id} />
        <SocialLinks company={company} />
        <Text className='text-base text-jego-muted-foreground mt-2'>{company.description}</Text>
      </Center>
      <View className='p-4'>
        <Text className={'text-xl font-bold text-jego-primary'}>
          {compactNumber(followersCount)} {pluralize('follower', followersCount)}
        </Text>
        <HStack className='items-start gap-2 mt-4'>
          <Icon as={MailIcon} size='lg' className='text-jego-muted-foreground' />
          <Text className='text-sm flex-1 text-jego-muted-foreground'>
            <Link href={`mailto:${company.email}`}>{company.email || '- - -'}</Link>
          </Text>
        </HStack>
        <HStack className='items-start gap-2 mt-2'>
          <Icon as={IconPhoneFilled} size='lg' className='text-jego-muted-foreground' />
          <Text className='text-sm flex-1 text-jego-muted-foreground'>
            <Link href={`tel:${company.phone}`}>{company.phone || '- - -'}</Link>
          </Text>
        </HStack>
        <HStack className='items-start gap-2 mt-2'>
          <Icon as={IconMapPinFilled} size='lg' className='text-jego-muted-foreground' />
          <Text className='text-sm flex-1 text-jego-muted-foreground'>
            {company.address || '- - -'}
          </Text>
        </HStack>
      </View>
      <HStack space='md' className='px-4 mb-5'>
        <CompanyFollowButtonToggle companyId={company.id} />
        <ChatButton companyUsers={company.users} />
        <Link href={`/appointments/edit/${company.id}`} asChild>
          <Button variant='solid' className='rounded-xl flex-1'>
            <ButtonText numberOfLines={1} className='text-sm text-jego-primary-foreground'>
              Prendre rendez-vous
            </ButtonText>
          </Button>
        </Link>
      </HStack>
    </Card>
  )
}

export const CompanyDetailsCard = memo(CompanyDetailsCardComponent)

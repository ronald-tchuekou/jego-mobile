import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Button, ButtonText } from '@/src/components/ui/button'
import { Card } from '@/src/components/ui/card'
import { Center } from '@/src/components/ui/center'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { IMAGES } from '@/src/lib/images'
import { compactNumber, getImageLink, pluralize } from '@/src/lib/utils'
import { CompanyModel } from '@/src/services/company-service'
import { IconMailFilled, IconMapPinFilled, IconPhoneFilled } from '@tabler/icons-react-native'
import { Link } from 'expo-router'
import { memo } from 'react'
import { Text, View } from 'react-native'
import ChatButton from './chat-button'
import CompanyFollowButtonToggle from './company-follow-button-toggle'
import { CompanyImageBanner } from './company-image-banner'
import SocialLinks from './social-links'

type Props = {
  company: CompanyModel
}

const CompanyDetailsCardComponent = ({ company }: Props) => {
  const companyLogo = company?.logo ? { uri: getImageLink(company.logo) } : IMAGES.default_company_logo
  const followersCount = company.followingCount || 0

  return (
    <Card className='p-0'>
      <CompanyImageBanner company={company} className={'rounded-t-lg'} />
      <Center className='px-4 pt-8 gap-2'>
        <Avatar size='xl' className='flex-none'>
          <AvatarImage source={companyLogo} alt={company.name} />
        </Avatar>
        <Text className='text-xl font-bold text-jego-foreground'>{company.name}</Text>
        {company.category?.name && <Text className='text-sm text-jego-primary'>{company.category?.name}</Text>}
        <SocialLinks company={company} />
        <Text className='text-base text-jego-muted-foreground'>{company.description}</Text>
      </Center>
      <View className='p-4'>
        <Text className={'text-xl font-bold text-jego-primary'}>
          {compactNumber(followersCount)} {pluralize('follower', followersCount)}
        </Text>
        <HStack className='items-start gap-2 mt-4'>
          <Icon as={IconMailFilled} size='lg' className='text-jego-foreground' />
          <Text className='text-sm flex-1 text-jego-foreground'>{company.email || '- - -'}</Text>
        </HStack>
        <HStack className='items-start gap-2 mt-2'>
          <Icon as={IconPhoneFilled} size='lg' className='text-jego-foreground' />
          <Text className='text-sm flex-1 text-jego-foreground'>{company.phone || '- - -'}</Text>
        </HStack>
        <HStack className='items-start gap-2 mt-2'>
          <Icon as={IconMapPinFilled} size='lg' className='text-jego-foreground' />
          <Text className='text-sm flex-1 text-jego-foreground'>{company.address || '- - -'}</Text>
        </HStack>
      </View>
      <HStack space='md' className='px-4 mb-5'>
        <CompanyFollowButtonToggle companyId={company.id} />
        <ChatButton companyUsers={company.users} />
        <Link href={`/appointments/edit/${company.id}`} asChild>
          <Button variant='solid' className='rounded-xl flex-1'>
            <ButtonText numberOfLines={1} className='text-sm'>Prendre rendez-vous</ButtonText>
          </Button>
        </Link>
      </HStack>
    </Card>
  )
}

export const CompanyDetailsCard = memo(CompanyDetailsCardComponent)

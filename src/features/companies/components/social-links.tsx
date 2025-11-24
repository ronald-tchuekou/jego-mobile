import { Button } from '@/src/components/ui/button'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { CompanyModel } from '@/src/services/company-service'
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
} from '@tabler/icons-react-native'
import { LinkIcon } from 'lucide-react-native'
import { memo } from 'react'
import { Linking } from 'react-native'

type Props = {
  company: CompanyModel
}

const SocialLinks = ({ company }: Props) => {
  const { website, facebook, instagram, twitter, linkedin, youtube, tiktok } = company

  function openLink(url: string) {
    Linking.openURL(url)
  }

  return (
    <HStack space='md' className='flex-wrap'>
      {website && (
        <Button variant='solid' className='bg-jego-accent rounded-xl px-3' size='md' onPress={() => openLink(website)}>
          <Icon as={LinkIcon} size='lg' className='text-jego-accent-foreground' />
        </Button>
      )}
      {facebook && (
        <Button variant='solid' className='bg-jego-accent rounded-xl px-3' size='md' onPress={() => openLink(facebook)}>
          <Icon as={IconBrandFacebook} size='lg' className='text-jego-accent-foreground' />
        </Button>
      )}
      {instagram && (
        <Button
          variant='solid'
          className='bg-jego-accent rounded-xl px-3'
          size='md'
          onPress={() => openLink(instagram)}
        >
          <Icon as={IconBrandInstagram} size='lg' className='text-jego-accent-foreground' />
        </Button>
      )}
      {twitter && (
        <Button variant='solid' className='bg-jego-accent rounded-xl px-3' size='md' onPress={() => openLink(twitter)}>
          <Icon as={IconBrandX} size='lg' className='text-jego-accent-foreground' />
        </Button>
      )}
      {linkedin && (
        <Button variant='solid' className='bg-jego-accent rounded-xl px-3' size='md' onPress={() => openLink(linkedin)}>
          <Icon as={IconBrandLinkedin} size='lg' className='text-jego-accent-foreground' />
        </Button>
      )}
      {youtube && (
        <Button variant='solid' className='bg-jego-accent rounded-xl px-3' size='md' onPress={() => openLink(youtube)}>
          <Icon as={IconBrandYoutube} size='lg' className='text-jego-accent-foreground' />
        </Button>
      )}
      {tiktok && (
        <Button variant='solid' className='bg-jego-accent rounded-xl px-3' size='md' onPress={() => openLink(tiktok)}>
          <Icon as={IconBrandTiktok} size='lg' className='text-jego-accent-foreground' />
        </Button>
      )}
    </HStack>
  )
}

export default memo(SocialLinks)

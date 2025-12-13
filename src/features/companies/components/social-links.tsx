import { Button } from '@/src/components/ui/button'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { globalStyles } from '@/src/lib/global-styles'
import { CompanyModel } from '@/src/services/company-service'
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
} from '@tabler/icons-react-native'
import * as WebBrowser from 'expo-web-browser'
import { LinkIcon } from 'lucide-react-native'
import { useColorScheme } from 'nativewind'
import { memo } from 'react'
import { Platform } from 'react-native'
import Toast from 'react-native-toast-message'
import zod from 'zod'

type Props = {
  company: CompanyModel
}

const SocialLinks = ({ company }: Props) => {
  const { website, facebook, instagram, twitter, linkedin, youtube, tiktok } = company
  const { colorScheme } = useColorScheme()
  const theme = colorScheme === 'dark' ? 'dark' : 'light'

  async function openLink(url: string) {
    try {
      const schema = zod.url()

      const verifyUrl = schema.parse(url)

      const options: WebBrowser.WebBrowserOpenOptions = {
        controlsColor: globalStyles.colors.primary[theme],
        toolbarColor: globalStyles.colors.card[theme],
      }

      if (Platform.OS === 'android') {
        const packages = await WebBrowser.getCustomTabsSupportingBrowsersAsync()
        options.secondaryToolbarColor = globalStyles.colors.card[theme]
        options.browserPackage = packages.preferredBrowserPackage
      }

      WebBrowser.openBrowserAsync(verifyUrl, options).then()
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Oops !!!',
        text2: "Le lien n'est pas un lien valide.",
        visibilityTime: 2000,
      })
    }
  }

  return (
    <HStack space='md' className='flex-wrap items-center justify-center'>
      {website && (
        <Button variant='solid' className='bg-accent rounded-xl px-3' size='md' onPress={() => openLink(website)}>
          <Icon as={LinkIcon} size='lg' className='text-accent-foreground' />
        </Button>
      )}
      {facebook && (
        <Button variant='solid' className='bg-accent rounded-xl px-3' size='md' onPress={() => openLink(facebook)}>
          <Icon as={IconBrandFacebook} size='lg' className='text-accent-foreground' />
        </Button>
      )}
      {instagram && (
        <Button variant='solid' className='bg-accent rounded-xl px-3' size='md' onPress={() => openLink(instagram)}>
          <Icon as={IconBrandInstagram} size='lg' className='text-accent-foreground' />
        </Button>
      )}
      {twitter && (
        <Button variant='solid' className='bg-accent rounded-xl px-3' size='md' onPress={() => openLink(twitter)}>
          <Icon as={IconBrandX} size='lg' className='text-accent-foreground' />
        </Button>
      )}
      {linkedin && (
        <Button variant='solid' className='bg-accent rounded-xl px-3' size='md' onPress={() => openLink(linkedin)}>
          <Icon as={IconBrandLinkedin} size='lg' className='text-accent-foreground' />
        </Button>
      )}
      {youtube && (
        <Button variant='solid' className='bg-accent rounded-xl px-3' size='md' onPress={() => openLink(youtube)}>
          <Icon as={IconBrandYoutube} size='lg' className='text-accent-foreground' />
        </Button>
      )}
      {tiktok && (
        <Button variant='solid' className='bg-accent rounded-xl px-3' size='md' onPress={() => openLink(tiktok)}>
          <Icon as={IconBrandTiktok} size='lg' className='text-accent-foreground' />
        </Button>
      )}
    </HStack>
  )
}

export default memo(SocialLinks)

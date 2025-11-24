import { Box } from '@/src/components/ui/box'
import { Button, ButtonIcon } from '@/src/components/ui/button'
import { Center } from '@/src/components/ui/center'
import { HStack } from '@/src/components/ui/hstack'
import { CompanyModel } from '@/src/services/company-service'
import { BuildingIcon, ClockIcon, ImageIcon, InfoIcon, ListIcon, ListTodoIcon } from 'lucide-react-native'
import { memo, useState } from 'react'
import { Text, View } from 'react-native'
import { cnBase } from 'tailwind-variants'
import CompanyAbout from './company-about'
import CompanyGallery from './company-gallery'
import CompanyPosts from './company-posts'
import CompanyPrestations from './company-prestations'
import CompanyProgram from './company-program'

type Props = {
  company: CompanyModel
}

const tabContent = [
  {
    title: 'A propos',
    value: 'about',
    icon: InfoIcon,
  },
  {
    title: 'Posts',
    value: 'posts',
    icon: ListIcon,
  },
  {
    title: 'Services',
    value: 'services',
    icon: BuildingIcon,
  },
  {
    title: 'Galérie',
    value: 'gallery',
    icon: ImageIcon,
  },
  {
    title: 'Programme',
    value: 'program',
    icon: ClockIcon,
  },
  {
    title: 'Avis',
    value: 'reviews',
    icon: ListTodoIcon,
  },
]

const CompanyTabsComponent = ({ company }: Props) => {
  const [activeTab, setActiveTab] = useState('about')

  function isActive(value: string) {
    return value === activeTab
  }

  return (
    <View className='py-5 w-full'>
      <HStack space='xs' className='justify-between border border-jego-border rounded-xl p-1 bg-jego-card'>
        {tabContent.map((tab) => (
          <Button
            key={tab.value}
            variant='link'
            className={cnBase(
              'border-jego-border flex-1 rounded-lg bg-transparent',
              isActive(tab.value) && 'bg-jego-accent',
            )}
            onPress={() => setActiveTab(tab.value)}
          >
            <ButtonIcon
              as={tab.icon}
              className={cnBase('text-jego-muted-foreground', isActive(tab.value) && 'text-jego-primary')}
            />
          </Button>
        ))}
      </HStack>
      <Box className='mt-3'>
        {activeTab === 'about' && <CompanyAbout company={company} />}
        {activeTab === 'posts' && <CompanyPosts company={company} />}
        {activeTab === 'services' && <CompanyPrestations company={company}/>}
        {activeTab === 'gallery' && <CompanyGallery company={company}/>}
        {activeTab === 'program' && <CompanyProgram company={company}/>}
        {activeTab === 'reviews' && (
          <Center className='py-10'>
            <Text className='font-body text-2xl text-center'>Reviews</Text>
          </Center>
        )}
      </Box>
    </View>
  )
}

export const CompanyTabs = memo(CompanyTabsComponent)

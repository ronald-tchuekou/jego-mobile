import { Avatar, AvatarFallbackText, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Card } from '@/src/components/ui/card'
import { IMAGES } from '@/src/lib/images'
import { getImageLink } from '@/src/lib/utils'
import { CompanyModel } from '@/src/services/company-service'
import { Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { cnBase } from 'tailwind-variants'
import { CompanyImageBanner } from './company-image-banner'

type Props = {
  company: CompanyModel
  className?: string
}

const CompanyItem = ({ company, className }: Props) => {
  const initials = company.name.charAt(0).toUpperCase()
  const companyLogo = company?.logo ? getImageLink(company.logo) : IMAGES.default_company_logo

  return (
    <Card>
      <CompanyImageBanner company={company} className={'rounded-t-lg'} />
      <View className={cnBase('p-2 flex gap-2 rounded-b-lg')}>
        <Avatar size='md' className='size-12 flex-none'>
          <AvatarImage src={companyLogo} alt={company.name} />
          <AvatarFallbackText className='text-xs'>{initials}</AvatarFallbackText>
        </Avatar>
        <View className='w-full'>
          <Text className='font-medium text-sm w-full'>
            {company.name}{' '}
            {company.category?.name && (
              <Badge variant='outline' className={'text-[10px] md:text-[10px]'}>
                {company.category?.name}
              </Badge>
            )}
          </Text>
          <Text className='text-xs mt-1 flex items-center gap-1'>
            <Svg className='size-4 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
              <Path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z'></Path>
              <Path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z'></Path>
            </Svg>
            {company.email || '- - -'}
          </Text>
          <Text className='text-xs mt-1 flex items-center gap-1'>
            <Svg className='size-4 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
              <Path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z'></Path>
            </Svg>
            {company.phone || '- - -'}
          </Text>
          <Text className='text-xs mt-1 flex items-center gap-1'>
            <Svg className='size-4 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
              <Path
                fillRule='evenodd'
                d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                clipRule='evenodd'
              ></Path>
            </Svg>
            {company.address || '- - -'}
          </Text>
        </View>
      </View>
    </Card>
  )
}

export default CompanyItem

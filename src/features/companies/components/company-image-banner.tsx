import { Image } from '@/src/components/ui/image'
import { IMAGES } from '@/src/lib/images'
import { getFullUrl } from '@/src/lib/utils'
import { CompanyModel } from '@/src/services/company-service'
import { memo, useState } from 'react'
import { Text, View } from 'react-native'
import { cnBase } from 'tailwind-variants'

type Props = {
  company: CompanyModel
  className?: string
}

const CompanyImageBannerComponent = ({ company, className }: Props) => {
  const [hasError, setHasError] = useState(false)

  const companyImageBanner = company?.bannerImage
    ? { uri: getFullUrl(company.bannerImage) }
    : IMAGES.default_company_banner_image

  return (
    <View
      className={cnBase(
        'w-full overflow-hidden rounded-t-xl bg-accent border-b border-border aspect-[4/1] relative',
        className,
      )}
    >
      {hasError ? (
        <View className='absolute inset-0 bg-muted flex items-center justify-center'>
          <Text className='text-muted-foreground text-sm text-center p-4'>
            Erreur lors du chargement de l&apos;image
          </Text>
        </View>
      ) : (
        <Image
          source={companyImageBanner}
          alt={company.name}
          className={cnBase('flex-1 object-cover object-center aspect-[4/1]')}
          onError={() => {
            setHasError(true)
          }}
          height={200}
          width={400}
        />
      )}
    </View>
  )
}

export const CompanyImageBanner = memo(CompanyImageBannerComponent)

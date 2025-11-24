import EmptyContent from '@/src/components/base/empty-content'
import { Grid, GridItem } from '@/src/components/ui/grid'
import { getImageUri } from '@/src/lib/utils'
import { CompanyModel } from '@/src/services/company-service'
import { memo } from 'react'
import { Image, Text } from 'react-native'

type Props = {
  company: CompanyModel
}

const CompanyGallery = ({ company }: Props) => {
  const images = company.images

  return (
    <>
      <Text className={'text-xl font-semibold mb-3'}>Gallérie de l&apos;entreprise</Text>
      {images.length === 0 ? (
        <EmptyContent text={'Aucune image disponible pour cette entreprise.'} />
      ) : (
        <Grid className='gap-[2px]' _extra={{ className: 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5' }}>
          {images.map((image) => {
            const imgUrl = getImageUri(image.path)

            return (
              <GridItem key={image.id} _extra={{ className: 'col-span-1' }}>
                <Image
                  key={image.id}
                  source={imgUrl}
                  className={`flex-1 h-[150px] bg-black`}
                  resizeMode='contain'
                  alt={image.name || 'Image'}
                />
              </GridItem>
            )
          })}
        </Grid>
      )}
    </>
  )
}

export default memo(CompanyGallery)

import EmptyContent from '@/src/components/base/empty-content'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import { formatPrice } from '@/src/lib/utils'
import { CompanyModel } from '@/src/services/company-service'
import { memo } from 'react'
import { Text } from 'react-native'

type Props = {
  company: CompanyModel
}

const CompanyPrestations = ({ company }: Props) => {
  const prestations = company.services

  return (
    <>
      <Text className={'text-xl font-semibold text-foreground mb-3'}>Prestations offertes</Text>
      {prestations.length === 0 ? (
        <EmptyContent text={'Aucune prestation disponible pour cette entreprise.'} />
      ) : (
        <VStack space='md'>
          {prestations.map((prestation) => (
            <Card key={prestation.id}>
              <HStack space='lg' className={'flex justify-between items-start'}>
                <Text className='text-lg font-semibold text-foreground'>{prestation.label}</Text>
                {prestation.price && (
                  <Text className={'font-semibold text-primary'}>{formatPrice(Number(prestation.price))}</Text>
                )}
              </HStack>
              <Text className='text-sm text-muted-foreground'>{prestation.description}</Text>
            </Card>
          ))}
        </VStack>
      )}
    </>
  )
}

export default memo(CompanyPrestations)

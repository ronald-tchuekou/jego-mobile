import EmptyContent from '@/src/components/base/empty-content'
import { CompanyModel } from '@/src/services/company-service'
import { Text } from 'react-native'

type Props = {
  company: CompanyModel
}

const CompanyAbout = ({ company }: Props) => {
  return (
    <>
      <Text className={'text-xl font-semibold text-jego-foreground mb-3'}>Biographie</Text>
      {!company.description ? (
        <EmptyContent text={'Aucune description disponible pour cette entreprise.'} />
      ) : (
        <Text className='text-base text-jego-foreground'>{company.description}</Text>
      )}
    </>
  )
}

export default CompanyAbout

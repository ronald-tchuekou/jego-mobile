import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { FlatList, RefreshControl } from 'react-native'
import useGetCompanies from '../hooks/use-get-companies'
import CompanyItem from './company-item'

type Props = { search?: string }

function ListCompanies({ search }: Props) {
  const { companies, isLoading, isRefetching, refetch } = useGetCompanies({ filters: { search } })

  return (
    <FlatList
      className='flex-1'
      contentContainerClassName='p-4 gap-4'
      data={companies}
      refreshing={isRefetching}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      ListEmptyComponent={isLoading ? <LoaderContent /> : <EmptyContent text={'Aucune entreprise pour le moment.'} />}
      renderItem={({ item }) => <CompanyItem company={item} />}
      keyExtractor={(item, index) => `${item.id}-${index}`}
    />
  )
}

export default ListCompanies

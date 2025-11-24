import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { useCompaniesViewStore } from '@/src/stores/companies-view-store'
import { FlatList, RefreshControl } from 'react-native'
import { useShallow } from 'zustand/shallow'
import useGetCompanies from '../hooks/use-get-companies'
import CompanyItem from './company-item'

type Props = { search?: string }

function ListCompanies({ search }: Props) {
  const { companies, isLoading } = useCompaniesViewStore(
    useShallow((s) => ({
      companies: s.companies,
      isLoading: s.isLoadingCompanies,
      page: s.page,
      totalPage: s.totalPage,
    })),
  )

  const { refetch } = useGetCompanies({ search: search })

  return (
    <FlatList
      className='flex-1'
      contentContainerClassName='p-4 gap-4'
      data={companies}
      refreshing={isLoading}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        // if (page < totalPage) mutate({ page: page + 1, search: search || undefined })
      }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      ListEmptyComponent={
        isLoading && companies.length === 0 ? (
          <LoaderContent />
        ) : (
          <EmptyContent text={'Aucune entreprise pour le moment.'} />
        )
      }
      // ListFooterComponent={
      //   isPending ? (
      //     <Center className='py-4'>
      //       <Spinner />
      //     </Center>
      //   ) : (
      //     <View className='h-5' />
      //   )
      // }
      renderItem={({ item }) => <CompanyItem company={item} />}
      keyExtractor={(item, index) => `${item.id}-${index}`}
    />
  )
}

export default ListCompanies

import { Center } from '@/src/components/ui/center'
import { Spinner } from '@/src/components/ui/spinner'
import { VStack } from '@/src/components/ui/vstack'
import { useCompaniesViewStore } from '@/src/stores/companies-view-store'
import { CircleSlash2Icon } from 'lucide-react-native'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import { useShallow } from 'zustand/shallow'
import useGetCompanies from '../hooks/use-get-companies'
import CompanyItem from './company-item'

type Props = { search?: string }

function ListCompanies({ search }: Props) {
  const { companies, isLoading, page, totalPage } = useCompaniesViewStore(
    useShallow((s) => ({
      companies: s.companies,
      isLoading: s.isLoadingCompanies,
      page: s.page,
      totalPage: s.totalPage,
    }))
  )

  const { mutate, isPending, refetch } = useGetCompanies({ search: search || undefined })

  return (
    <FlatList
      className='flex-1'
      contentContainerClassName='p-4 gap-4'
        data={companies}
        refreshing={isLoading||isPending}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (page < totalPage) mutate({ page: page + 1, search: search || undefined })
      }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      ListEmptyComponent={
        isLoading ? undefined : (
          <Center className='w-full min-h-80'>
            <VStack className='p-3 items-center' space='md'>
              <CircleSlash2Icon size={40} color={'#666666'} />
              <Text className='text-base text-jego-muted-foreground'>Aucune entreprise pour le moment.</Text>
            </VStack>
          </Center>
        )
      }
      ListFooterComponent={
        isPending ? (
          <Center className='py-4'>
            <Spinner />
          </Center>
        ) : (
          <View className='h-5' />
        )
      }
      renderItem={({ item }) => <CompanyItem company={item} />}
      keyExtractor={(item) => item.id}
    />
  )
}

export default ListCompanies

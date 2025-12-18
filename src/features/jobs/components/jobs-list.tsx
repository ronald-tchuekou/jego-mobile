import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { FlatList, RefreshControl } from 'react-native'
import useGetJobs from '../hooks/use-get-jobs'
import JobItem from './job-item'

type Props = { search?: string }

function JobsList({ search }: Props) {
  const { jobs, isLoading, isRefetching, refetch } = useGetJobs({ filter: { companyName: search } })

  return (
    <FlatList
      className='flex-1'
      contentContainerClassName='p-4 gap-4'
      data={jobs}
      refreshing={isRefetching}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      ListEmptyComponent={
        isLoading ? <LoaderContent /> : <EmptyContent text={"Aucune offre d'emploi pour le moment."} />
      }
      renderItem={({ item }) => <JobItem job={item} />}
      keyExtractor={(item, index) => `${item.id}-${index}`}
    />
  )
}

export default JobsList

import { BackButton } from '@/src/components/base/back-button'
import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import JobApplicationItem from '@/src/features/job-applications/components/job-application-item'
import useGetJobApplications from '@/src/features/job-applications/hooks/use-get-job-applications'
import React from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import { HeaderContainer } from '@/src/components/base/header-container'

export default function JobApplicationsListScreen() {
  const { applications, isLoading, refetch, isRefetching } = useGetJobApplications({
    filters: { page: 1, limit: 30 },
  })

  return (
    <View style={{ flex: 1 }} className='bg-background'>
      <HeaderContainer>
        <HStack space='md'>
          <BackButton />
          <VStack className='flex-1'>
            <Text className='font-semibold text-base text-foreground' numberOfLines={1}>
              Mes candidatures
            </Text>
            <Text className='text-sm text-muted-foreground'>Toutes vos candidatures de jobs.</Text>
          </VStack>
        </HStack>
      </HeaderContainer>

      {isLoading ? (
        <View className='flex-1'>
          <LoaderContent />
        </View>
      ) : (
        <FlatList
          data={applications}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: application }) => <JobApplicationItem application={application} />}
          ListEmptyComponent={<EmptyContent text='Aucune candidature pour le moment.' />}
          ListFooterComponent={<View className='h-20' />}
          contentContainerClassName='py-4'
          className='flex-1'
        />
      )}
    </View>
  )
}

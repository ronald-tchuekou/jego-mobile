import { AppointmentStatusLabel } from '@/src/components/base/appointment-status-label'
import { BackButton } from '@/src/components/base/back-button'
import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { VStack } from '@/src/components/ui/vstack'
import useGetAppointments from '@/src/features/appointments/hooks/use-get-appointments'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { formatDate, getCompanyLogoUri } from '@/src/lib/utils'
import { IconCalendar } from '@tabler/icons-react-native'
import { Link } from 'expo-router'
import React from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'

export default function AppointmentsListScreen() {
  const height = getStatusBarHeight()
  const { appointments, isLoading, refetch, isRefetching } = useGetAppointments({
    filters: { page: 1, limit: 30 },
  })

  return (
    <View style={{ flex: 1 }} className='bg-jego-background'>
      <HStack space='md' className='p-4 bg-jego-card border-b border-jego-border' style={{ paddingTop: height + 10 }}>
        <BackButton />
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-jego-foreground' numberOfLines={1}>
            Mes rendez-vous
          </Text>
          <Text className='text-sm text-jego-muted-foreground'>
            Consultez vos rendez-vous pris avec les entreprises.
          </Text>
        </VStack>
      </HStack>

      {isLoading ? (
        <View className='flex-1'>
          <LoaderContent />
        </View>
      ) : (
        <FlatList
          data={appointments}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: appointment }) => {
            const logo = getCompanyLogoUri(appointment.company?.logo)
            return (
              <Card className='p-0 mx-4 mb-4'>
                <Link href={`/appointments/${appointment.id}`}>
                  <HStack className='items-start p-3' space='md'>
                    <Avatar size='md' className='size-12 flex-none'>
                      <AvatarImage source={logo} alt={appointment.company?.name || ''} />
                    </Avatar>
                    <VStack className='flex-1' space='xs'>
                      <Text className='text-base font-medium text-jego-foreground' numberOfLines={1}>
                        {appointment.company?.name}
                      </Text>
                      <HStack className='items-center gap-1'>
                        <Icon as={IconCalendar} size='sm' className='text-jego-muted-foreground' />
                        <Text className='text-xs text-jego-muted-foreground'>
                          {formatDate(appointment.date)} • {appointment.time}
                        </Text>
                      </HStack>
                      <Text className='text-base text-jego-foreground mt-2' numberOfLines={2}>
                        {appointment.subject}
                      </Text>
                      <AppointmentStatusLabel status={appointment.status} />
                    </VStack>
                  </HStack>
                </Link>
              </Card>
            )
          }}
          ListEmptyComponent={<EmptyContent text='Aucun rendez-vous pour le moment.' />}
          ListFooterComponent={<View className='h-20' />}
          contentContainerClassName='py-4'
          className='flex-1'
        />
      )}
    </View>
  )
}

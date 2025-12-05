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
import React from 'react'
import { ScrollView, Text, View } from 'react-native'

export default function AppointmentsListScreen() {
  const height = getStatusBarHeight()
  const { appointments, isLoading } = useGetAppointments({
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
          <Text className='text-sm text-jego-muted-foreground'>Consultez vos rendez-vous pris avec les entreprises.</Text>
        </VStack>
      </HStack>

      <ScrollView className='flex-1' contentContainerClassName='p-4'>
        {isLoading ? (
          <LoaderContent />
        ) : appointments.length ? (
          <VStack space='md'>
            {appointments.map((appointment) => {
              const logo = getCompanyLogoUri(appointment.company?.logo)
              return (
                <Card key={appointment.id} className='p-3'>
                  <HStack className='items-start' space='md'>
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
                      <StatusPill status={appointment.status} />
                    </VStack>
                  </HStack>
                </Card>
              )
            })}
          </VStack>
        ) : (
          <EmptyContent text='Aucun rendez-vous pour le moment.' />
        )}
        <View className='h-20' />
      </ScrollView>
    </View>
  )
}

function StatusPill({ status }: { status: string }) {
  const label =
    status === 'pending'
      ? 'En attente'
      : status === 'confirmed'
        ? 'Confirmé'
        : status === 'cancelled'
          ? 'Annulé'
          : status === 'completed'
            ? 'Terminé'
            : status

  const colorClasses =
    status === 'pending'
      ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
      : status === 'confirmed'
        ? 'bg-green-500/10 text-green-600 border-green-500/30'
        : status === 'cancelled'
          ? 'bg-red-500/10 text-red-600 border-red-500/30'
          : 'bg-blue-500/10 text-blue-600 border-blue-500/30'

  return (
    <View className={`self-start mt-1 px-2 py-1 rounded-full border ${colorClasses}`}>
      <Text className='text-xs'>{label}</Text>
    </View>
  )
}


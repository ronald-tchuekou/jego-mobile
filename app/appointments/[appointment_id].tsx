import { AppointmentStatusLabel } from '@/src/components/base/appointment-status-label'
import { BackButton } from '@/src/components/base/back-button'
import { LoaderContent } from '@/src/components/base/loader-content'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { VStack } from '@/src/components/ui/vstack'
import useGetAppointment from '@/src/features/appointments/hooks/use-get-appointment'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { formatDate, getCompanyLogoUri } from '@/src/lib/utils'
import { IconCalendar, IconMail, IconPhone } from '@tabler/icons-react-native'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'

export default function AppointmentDetailsScreen() {
  const height = getStatusBarHeight()
  const { appointment_id } = useLocalSearchParams<{ appointment_id: string }>()
  const { appointment, isLoading } = useGetAppointment(appointment_id)

  const logo = getCompanyLogoUri(appointment?.company?.logo)

  return (
    <View style={{ flex: 1 }} className='bg-jego-background'>
      <HStack space='md' className='p-4 bg-jego-card border-b border-jego-border' style={{ paddingTop: height + 10 }}>
        <BackButton />
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-jego-foreground' numberOfLines={1}>
            Détails du rendez-vous
          </Text>
          <Text className='text-sm text-jego-muted-foreground'>Informations complètes sur votre rendez-vous.</Text>
        </VStack>
      </HStack>

      {isLoading ? (
        <LoaderContent />
      ) : (
        <ScrollView className='flex-1' contentContainerClassName='p-4'>
          <Card className='p-4'>
            <HStack className='items-start' space='md'>
              <Avatar size='md' className='size-12 flex-none'>
                <AvatarImage source={logo} alt={appointment?.company?.name || ''} />
              </Avatar>
              <VStack className='flex-1' space='xs'>
                <Text className='text-lg font-semibold text-jego-foreground' numberOfLines={1}>
                  {appointment?.company?.name}
                </Text>
                <HStack className='items-center gap-1'>
                  <Icon as={IconCalendar} size='sm' className='text-jego-muted-foreground' />
                  <Text className='text-sm text-jego-muted-foreground'>
                    {formatDate(appointment?.date || '')} • {appointment?.time}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <AppointmentStatusLabel status={appointment?.status || ''} />
          </Card>

          <Card className='p-4 mt-4'>
            <Text className='text-base font-medium text-jego-foreground mb-2'>Objet</Text>
            <Text className='text-sm text-jego-foreground'>{appointment?.subject}</Text>
          </Card>

          {appointment?.content ? (
            <Card className='p-4 mt-4'>
              <Text className='text-base font-medium text-jego-foreground mb-2'>Message</Text>
              <Text className='text-sm text-jego-foreground'>{appointment?.content}</Text>
            </Card>
          ) : null}

          <Card className='p-4 mt-4'>
            <Text className='text-base font-medium text-jego-foreground mb-2'>Entreprise</Text>
            <VStack space='sm'>
              {!!appointment?.company?.email && (
                <HStack className='items-center gap-2'>
                  <Icon as={IconMail} size='sm' className='text-jego-muted-foreground' />
                  <Text className='text-sm text-jego-muted-foreground'>{appointment?.company?.email}</Text>
                </HStack>
              )}
              {!!appointment?.company?.phone && (
                <HStack className='items-center gap-2'>
                  <Icon as={IconPhone} size='sm' className='text-jego-muted-foreground' />
                  <Text className='text-sm text-jego-muted-foreground'>{appointment?.company?.phone}</Text>
                </HStack>
              )}
            </VStack>
          </Card>

          <View className='h-20' />
        </ScrollView>
      )}
    </View>
  )
}

import { BackButton } from '@/src/components/base/back-button'
import EmptyContent from '@/src/components/base/empty-content'
import { HeaderContainer } from '@/src/components/base/header-container'
import { LoaderContent } from '@/src/components/base/loader-content'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { VStack } from '@/src/components/ui/vstack'
import { CompanyImageBanner } from '@/src/features/companies/components/company-image-banner'
import useGetUserFollowings from '@/src/features/followings/hooks/use-get-user-followings'
import { getCompanyLogoUri } from '@/src/lib/utils'
import { IconMapPinFilled, IconPhoneFilled } from '@tabler/icons-react-native'
import { Link } from 'expo-router'
import { MailIcon } from 'lucide-react-native'
import React from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'

export default function FollowingsScreen() {
  const { followings, isLoading, refetch, isRefetching } = useGetUserFollowings({
    filters: { page: 1, limit: 30 },
  })

  return (
    <View style={{ flex: 1 }} className='bg-background'>
      <HeaderContainer>
        <HStack space='md'>
          <BackButton />
          <VStack className='flex-1'>
            <Text className='font-semibold text-base text-foreground' numberOfLines={1}>
              Mes followings
            </Text>
            <Text className='text-sm text-muted-foreground'>Toutes les entreprises que vous suivez.</Text>
          </VStack>
        </HStack>
      </HeaderContainer>

      {isLoading ? (
        <View className='flex-1'>
          <LoaderContent />
        </View>
      ) : (
        <FlatList
          data={followings}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          keyExtractor={(item) => item.companyId}
          renderItem={({ item }) => {
            const company = item.company
            const companyLogo = getCompanyLogoUri(company.logo)

            return (
              <Card className='p-0 mx-4 mb-4 border-2 border-border'>
                <Link href={`/company/${company.id}`}>
                  <CompanyImageBanner company={company} className={'rounded-t-lg'} />
                  <HStack className='p-3 gap-3'>
                    <Avatar size='md' className='size-12 flex-none'>
                      <AvatarImage source={companyLogo} alt={company.name} />
                    </Avatar>
                    <VStack className='flex-1'>
                      <Text className='font-medium text-lg text-foreground'>{company.name}</Text>
                      {company.category?.name && <Text className='text-xs text-primary'>{company.category?.name}</Text>}
                      <HStack className='items-start gap-1.5 mt-2'>
                        <Icon as={MailIcon} size='lg' className='text-muted-foreground' />
                        <Text className='text-sm flex-1 text-muted-foreground'>{company.email || '- - -'}</Text>
                      </HStack>
                      <HStack className='items-start gap-1.5 mt-1'>
                        <Icon as={IconPhoneFilled} size='lg' className='text-muted-foreground' />
                        <Text className='text-sm flex-1 text-muted-foreground'>{company.phone || '- - -'}</Text>
                      </HStack>
                      <HStack className='items-start gap-1.5 mt-1'>
                        <Icon as={IconMapPinFilled} size='lg' className='text-muted-foreground' />
                        <Text className='text-sm flex-1 text-muted-foreground'>{company.address || '- - -'}</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </Link>
              </Card>
            )
          }}
          ListEmptyComponent={<EmptyContent text='Aucune entreprise suivie pour le moment.' />}
          ListFooterComponent={<View className='h-20' />}
          contentContainerClassName='py-4'
          className='flex-1'
        />
      )}
    </View>
  )
}

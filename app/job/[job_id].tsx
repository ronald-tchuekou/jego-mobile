import { BackButton } from '@/src/components/base/back-button'
import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Badge, BadgeText } from '@/src/components/ui/badge'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { CalendarDaysIcon, GlobeIcon, Icon, MailIcon, PhoneIcon } from '@/src/components/ui/icon'
import { VStack } from '@/src/components/ui/vstack'
import SendApplication from '@/src/features/jobs/components/send-application'
import useGetJob from '@/src/features/jobs/hooks/use-get-job'
import { formatDate, getCompanyLogoUri } from '@/src/lib/utils'
import { JobModel, JobStatus } from '@/src/services/job-service'
import { IconMapPinFilled, IconUsers } from '@tabler/icons-react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function JobDetailsScreen() {
  const { job_id } = useLocalSearchParams<{ job_id: string }>()
  const { job, isLoading } = useGetJob(job_id)

  return (
    <SafeAreaView className='flex-1 bg-jego-card'>
      <HStack space='md' className='p-4 bg-jego-card border-b border-jego-border'>
        <BackButton />
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-jego-foreground' numberOfLines={1}>
            {job?.title || '- - -'}
          </Text>
          <Text className='text-sm text-typography-600'>Publié le {job ? formatDate(job.createdAt) : '- - -'}</Text>
        </VStack>
      </HStack>
      <ScrollView className='flex-1 bg-jego-background' contentContainerClassName={'bg-jego-background'}>
        {isLoading ? (
          <LoaderContent />
        ) : !job ? (
          <EmptyContent text="Cette offre d'emploi n'existe pas." />
        ) : (
          <Content job={job} />
        )}
        <View className='h-20' />
      </ScrollView>
      <SendApplication job={job} />
    </SafeAreaView>
  )
}

const Content = ({ job }: { job: JobModel }) => {
  const website =
    job.companyWebsite && (job.companyWebsite.startsWith('http') ? job.companyWebsite : `https://${job.companyWebsite}`)

  return (
    <>
      <View className={'h-3'} />
      <View className='px-4 pb-6'>
        <VStack className='gap-4'>
          {/* Header: Status and Title */}
          <HStack className='items-center gap-2 flex-wrap'>
            {!(job.expiresAt && new Date(job.expiresAt) < new Date()) ? (
              <Badge action={job.status === JobStatus.OPEN ? 'success' : 'error'} size='sm'>
                <BadgeText size='sm'>{job.status === JobStatus.OPEN ? 'Ouvert' : 'Fermé'}</BadgeText>
              </Badge>
            ) : (
              <Badge action='error' size='sm'>
                <BadgeText size='sm'>Expiré</BadgeText>
              </Badge>
            )}
          </HStack>
          <Text className='text-2xl font-bold text-jego-foreground'>{job.title}</Text>

          {/* Meta info */}
          <VStack className='gap-2'>
            {!!job.user?.displayName && (
              <Text className='text-sm text-jego-muted-foreground'>Par {job.user.displayName}</Text>
            )}
            <HStack className='items-center gap-1'>
              <Icon as={CalendarDaysIcon} size='sm' className='text-jego-muted-foreground' />
              <Text className='text-sm text-jego-muted-foreground'>Publié le {formatDate(job.createdAt)}</Text>
            </HStack>
            {new Date(job.updatedAt).toDateString() !== new Date(job.createdAt).toDateString() && (
              <HStack className='items-center gap-1'>
                <Icon as={CalendarDaysIcon} size='sm' className='text-jego-muted-foreground' />
                <Text className='text-sm text-jego-muted-foreground'>Modifié le {formatDate(job.updatedAt)}</Text>
              </HStack>
            )}
            {!!job.expiresAt && new Date(job.expiresAt) > new Date() && (
              <HStack className='items-center gap-1'>
                <Icon as={CalendarDaysIcon} size='sm' className='text-jego-muted-foreground' />
                <Text className='text-sm text-jego-muted-foreground'>Expire le {formatDate(job.expiresAt)}</Text>
              </HStack>
            )}
          </VStack>

          {/* Description */}
          {!!job.description && <Text className='text-base leading-6 text-jego-foreground'>{job.description}</Text>}

          {/* Applications count */}
          <HStack className='items-center gap-1'>
            <Icon as={IconUsers} size='sm' className='text-jego-muted-foreground' />
            <Text className='text-sm text-jego-muted-foreground'>{job.applicationCount} candidatures</Text>
          </HStack>

          {/* Company Information */}
          {(job.companyName ||
            job.companyWebsite ||
            job.companyEmail ||
            job.companyPhone ||
            job.companyAddress ||
            job.companyCity ||
            job.companyState ||
            job.companyZip ||
            job.companyCountry ||
            job.companyLogo) && (
            <Card className='p-0 border border-jego-border'>
              <VStack className='gap-4 p-4'>
                <Text className='text-lg font-semibold text-jego-foreground'>Informations sur l&apos;entreprise</Text>

                <HStack space='md'>
                  {/* Company Avatar */}
                  <Avatar size='lg' className='size-20'>
                    <AvatarImage source={getCompanyLogoUri(job.companyLogo || undefined)} alt={job.companyName || ''} />
                  </Avatar>

                  {/* Company Info */}
                  <VStack space='md' className='flex-1'>
                    {!!job.companyName && (
                      <Text className='text-base font-medium text-jego-foreground'>{job.companyName}</Text>
                    )}

                    {(job.companyAddress ||
                      job.companyCity ||
                      job.companyState ||
                      job.companyZip ||
                      job.companyCountry) && (
                      <HStack className='items-start gap-2'>
                        <Icon as={IconMapPinFilled} size='md' className='text-jego-muted-foreground' />
                        <VStack className='flex-1 gap-1'>
                          {!!job.companyAddress && (
                            <Text className='text-sm text-jego-muted-foreground'>{job.companyAddress}</Text>
                          )}
                          <Text className='text-sm text-jego-muted-foreground'>
                            {[job.companyCity, job.companyState, job.companyZip, job.companyCountry]
                              .filter(Boolean)
                              .join(', ')}
                          </Text>
                        </VStack>
                      </HStack>
                    )}

                    {!!website && (
                      <HStack className='items-center gap-2'>
                        <Icon as={GlobeIcon} size='md' className='text-jego-muted-foreground' />
                        <Text className='text-sm text-jego-primary'>
                          <Link href={website as any}>{job.companyWebsite}</Link>
                        </Text>
                      </HStack>
                    )}

                    {!!job.companyEmail && (
                      <HStack className='items-center gap-2'>
                        <Icon as={MailIcon} size='md' className='text-jego-muted-foreground' />
                        <Text className='text-sm text-jego-primary'>
                          <Link href={`mailto:${job.companyEmail}`}>{job.companyEmail}</Link>
                        </Text>
                      </HStack>
                    )}

                    {!!job.companyPhone && (
                      <HStack className='items-center gap-2'>
                        <Icon as={PhoneIcon} size='md' className='text-jego-muted-foreground' />
                        <Text className='text-sm text-jego-primary'>
                          <Link href={`tel:${job.companyPhone}`}>{job.companyPhone}</Link>
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </HStack>
              </VStack>
            </Card>
          )}
        </VStack>
      </View>
    </>
  )
}

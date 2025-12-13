import { Avatar, AvatarFallbackText, AvatarImage } from '@/src/components/ui/avatar'
import { Badge, BadgeText } from '@/src/components/ui/badge'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { CalendarDaysIcon, Icon } from '@/src/components/ui/icon'
import { VStack } from '@/src/components/ui/vstack'
import { formatDate, getCompanyLogoUri } from '@/src/lib/utils'
import { JobModel, JobStatus } from '@/src/services/job-service'
import { IconMapPinFilled, IconUsers } from '@tabler/icons-react-native'
import { Link } from 'expo-router'
import { memo } from 'react'
import { Text } from 'react-native'

type Props = {
  job: JobModel
}

const JobItemComponent = ({ job }: Props) => {
  const isExpired = !!job.expiresAt && new Date(job.expiresAt) < new Date()
  const companyLogo = getCompanyLogoUri(job.companyLogo || '')

  return (
    <Link href={`/job/${job.id}`}>
      <Card className='p-0 border border-border'>
        <VStack className='gap-3 p-4'>
          {/* Company Info */}
          <HStack className='items-center gap-3'>
            <Avatar size='md' className='size-12 flex-none'>
              <AvatarImage source={companyLogo} alt={job.companyName || ''} />
              {job.companyName ? null : <AvatarFallbackText>CO</AvatarFallbackText>}
            </Avatar>
            <VStack className='flex-1'>
              {!!job.companyName && (
                <Text numberOfLines={1} className='text-base font-medium text-foreground'>
                  {job.companyName}
                </Text>
              )}
              {(job.companyCity || job.companyState) && (
                <HStack className='items-center gap-1'>
                  <Icon as={IconMapPinFilled} size='sm' className='text-muted-foreground' />
                  <Text numberOfLines={1} className='text-xs text-muted-foreground'>
                    {[job.companyCity, job.companyState].filter(Boolean).join(', ')}
                  </Text>
                </HStack>
              )}
            </VStack>
          </HStack>

          {/* Title & Description */}
          <VStack className='gap-1'>
            <Text numberOfLines={1} className='text-lg font-semibold text-foreground'>
              {job.title}
            </Text>
            {!!job.description && (
              <Text numberOfLines={2} className='text-sm text-muted-foreground'>
                {job.description}
              </Text>
            )}
          </VStack>

          {/* Status */}
          <HStack className='gap-2'>
            {!isExpired && (
              <Badge action={job.status === JobStatus.OPEN ? 'success' : 'error'} size='sm'>
                <BadgeText size='sm'>{job.status === JobStatus.OPEN ? 'Ouvert' : 'Fermé'}</BadgeText>
              </Badge>
            )}
            {isExpired && (
              <Badge action='error' size='sm'>
                <BadgeText size='sm'>Expiré</BadgeText>
              </Badge>
            )}
          </HStack>

          {/* Applications count */}
          <HStack className='items-center gap-1'>
            <Icon as={IconUsers} size='sm' className='text-muted-foreground' />
            <Text className='text-sm text-muted-foreground'>{job.applicationCount} candidatures</Text>
          </HStack>

          {/* Expiration date */}
          {job.expiresAt && !isExpired && (
            <HStack className='items-center gap-1'>
              <Icon as={CalendarDaysIcon} size='sm' className='text-muted-foreground' />
              <Text className='text-sm text-muted-foreground'>Expire le {formatDate(job.expiresAt)}</Text>
            </HStack>
          )}

          {/* Published date */}
          <HStack className='items-center justify-between'>
            <Text className='text-xs text-muted-foreground'>Publié le {formatDate(job.createdAt)}</Text>
          </HStack>
        </VStack>
      </Card>
    </Link>
  )
}

export default memo(JobItemComponent)

import { JobApplicationStatusLabel } from '@/src/components/base/job-application-status-label'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { VStack } from '@/src/components/ui/vstack'
import { formatDate, getCompanyLogoUri } from '@/src/lib/utils'
import { JobApplicationModel } from '@/src/services/job-application-service'
import { IconBriefcase, IconCalendar } from '@tabler/icons-react-native'
import { Link } from 'expo-router'
import { memo } from 'react'
import { Text } from 'react-native'

type Props = {
  application: JobApplicationModel
}

const JobApplicationItemComponent = ({ application }: Props) => {
  if (!application.job) {
    return null
  }

  const companyLogo = getCompanyLogoUri(application.job.companyLogo || '')

  return (
    <Card className='p-0 mx-4 mb-4'>
      <Link href={`/job/${application.jobId}`}>
        <HStack className='items-start p-3' space='md'>
          <Avatar size='md' className='size-12 flex-none'>
            <AvatarImage source={companyLogo} alt={application.job.companyName || ''} />
          </Avatar>
          <VStack className='flex-1' space='xs'>
            <Text className='text-base font-medium text-foreground' numberOfLines={1}>
              {application.job.title || "Offre d'emploi"}
            </Text>
            {application.job.companyName && (
              <HStack className='items-center gap-1'>
                <Icon as={IconBriefcase} size='sm' className='text-muted-foreground' />
                <Text className='text-xs text-muted-foreground' numberOfLines={1}>
                  {application.job.companyName}
                </Text>
              </HStack>
            )}
            <HStack className='items-center gap-1'>
              <Icon as={IconCalendar} size='sm' className='text-muted-foreground' />
              <Text className='text-xs text-muted-foreground'>
                Candidature envoyée le {formatDate(application.createdAt)}
              </Text>
            </HStack>
            <JobApplicationStatusLabel status={application.status} />
          </VStack>
        </HStack>
      </Link>
    </Card>
  )
}

export default memo(JobApplicationItemComponent)

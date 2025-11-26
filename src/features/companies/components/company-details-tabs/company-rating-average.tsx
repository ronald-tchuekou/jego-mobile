import { HStack } from '@/src/components/ui/hstack'
import { Skeleton } from '@/src/components/ui/skeleton'
import { companyReviewKey } from '@/src/lib/query-kye'
import CompanyReviewService from '@/src/services/company-review-service'
import { Rating } from '@kolking/react-native-rating'
import { useQuery } from '@tanstack/react-query'
import { memo } from 'react'
import { Text } from 'react-native'

type Props = {
  companyId: string
}

const CompanyRatingAverage = ({ companyId }: Props) => {
  const { data: rating, isLoading } = useQuery({
    queryKey: companyReviewKey.detail(companyId),
    async queryFn({ queryKey }) {
      const companyId = queryKey[2]
      return CompanyReviewService.getCompanyStats(companyId)
    },
  })

  if (isLoading) return <Skeleton className='w-32 h-8' />

  const ratingValue = rating?.averageRating || 0

  return (
    <HStack space='md' className='items-center my-2'>
      <Rating
        style={{ backgroundColor: 'transparent' }}
        rating={ratingValue}
        maxRating={5}
        size={20}
        scale={1}
        disabled
      />
      <Text className='text-base text-jego-muted-foreground'>{ratingValue.toFixed(1)}/5</Text>
    </HStack>
  )
}

export default memo(CompanyRatingAverage)

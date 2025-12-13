import EmptyContent from '@/src/components/base/empty-content'
import { ExpandableText } from '@/src/components/base/expandable-text'
import { LoaderContent } from '@/src/components/base/loader-content'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import { formatDate, getUserProfileImageUri } from '@/src/lib/utils'
import { CompanyModel } from '@/src/services/company-service'
import { useCompanyReviewsStore } from '@/src/stores/company-reviews-store'
import { Rating } from '@kolking/react-native-rating'
import { memo } from 'react'
import { Text } from 'react-native'
import { useShallow } from 'zustand/shallow'
import useGetCompanyReview from '../../hooks/use-get-company-review'

type Props = {
  company: CompanyModel
}

const CompanyReviews = ({ company }: Props) => {
  useGetCompanyReview({ companyId: company.id })
  const { reviews, isLoading } = useCompanyReviewsStore(
    useShallow((s) => ({ reviews: s.reviews, isLoading: s.isLoading })),
  )

  return (
    <>
      <Text className={'text-xl font-semibold text-foreground mb-3'}>Avis sur l&apos;entreprise</Text>
      {isLoading ? (
        <LoaderContent />
      ) : reviews.length === 0 ? (
        <EmptyContent text='Aucun avis donné sur cette entreprise.' />
      ) : (
        <VStack space='md'>
          {reviews.map((review) => {
            const profileSrc = getUserProfileImageUri(review.user?.profileImage)

            return (
              <Card key={review.id}>
                <HStack space='md' className='mb-3 items-center'>
                  <Avatar>
                    <AvatarImage source={profileSrc} />
                  </Avatar>
                  <VStack space='xs'>
                    <Text className={'line-clamp-1 text-foreground font-bold'}>{review.user.displayName}</Text>
                    <HStack space='md' className={'flex items-center'}>
                      <Rating
                        disabled
                        scale={1}
                        size={15}
                        rating={review.rating}
                        maxRating={5}
                        baseColor={'rgba(150, 150, 150, 0.4)'}
                      />
                      <Text className={'block text-xs text-muted-foreground'}>{formatDate(review.createdAt)}</Text>
                    </HStack>
                  </VStack>
                </HStack>
                <ExpandableText maxLength={80} text={review.comment} className='text-sm mb-0 px-0' />
              </Card>
            )
          })}
        </VStack>
      )}
    </>
  )
}

export default memo(CompanyReviews)

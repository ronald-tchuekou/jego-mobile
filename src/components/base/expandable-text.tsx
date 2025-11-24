import { truncateAtWordBoundary } from '@/src/lib/utils'
import { useRouter } from 'expo-router'
import { memo, useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { cnBase } from 'tailwind-variants'

interface Props {
  postId?: string
  text: string
  maxLength?: number
  className?: string
  reduce?: boolean
}

function ExpandableTextComponent({ postId, text, maxLength = 150, className = '', reduce = true }: Props) {
  const router = useRouter()

  const [isExpanded, setIsExpanded] = useState(false)

  // Initialize truncation logic
  const shouldTruncate = text.length > maxLength
  const truncatedText = shouldTruncate ? truncateAtWordBoundary(text, maxLength) : text
  const displayText = !reduce ? text : isExpanded ? text : truncatedText

  const showDetails = () => {
    if (postId)
      router.push({
        pathname: '/post/[post_id]',
        params: { post_id: postId },
      })
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={!postId}
      onPress={showDetails}
      className={cnBase('px-4 pb-3', className)}
    >
      <Text className='text-base text-jego-foreground'>
        {displayText}
        {shouldTruncate && !isExpanded && reduce && <Text className='text-jego-muted-foreground'>...&nbsp;</Text>}
        {shouldTruncate && reduce && (
          <>
            {isExpanded && '\n'}
            <Text
              onPress={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className='font-bold text-jego-primary'
            >
              {isExpanded ? 'Voir moins' : 'Voir plus'}
            </Text>
          </>
        )}
      </Text>
    </TouchableOpacity>
  )
}

export const ExpandableText = memo(ExpandableTextComponent)

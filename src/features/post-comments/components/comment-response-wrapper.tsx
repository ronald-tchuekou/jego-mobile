'use client'

import { Center } from '@/src/components/ui/center'
import { Spinner } from '@/src/components/ui/spinner'
import { VStack } from '@/src/components/ui/vstack'
import useGetPostCommentResponses from '@/src/features/post-comments/hooks/use-get-post-comment-responses'
import React from 'react'
import { Text } from 'react-native'
import CommentResponseItem from './comment-response-item'

type Props = { commentId: string }

export default function CommentResponseWrapper({ commentId }: Props) {
  const { isLoading, comments } = useGetPostCommentResponses(commentId)

  if (isLoading) {
    return (
      <Center className='min-h-20'>
        <Spinner />
      </Center>
    )
  }

  if (!comments.length) {
    return (
      <Center className='min-h-20'>
        <Text className='text-sm text-muted-foreground'>Aucune réponse au commentaire pour le moment</Text>
      </Center>
    )
  }

  return (
    <VStack className='mt-3' space='xl'>
      {comments.map((comment) => (
        <CommentResponseItem key={comment.id} commentResponse={comment} />
      ))}
    </VStack>
  )
}

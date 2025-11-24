'use client'

import { Center } from '@/src/components/ui/center'
import { Icon } from '@/src/components/ui/icon'
import { Spinner } from '@/src/components/ui/spinner'
import { VStack } from '@/src/components/ui/vstack'
import useGetPostComments from '@/src/features/post-comments/hooks/use-get-post-comments'
import { PostModel } from '@/src/services/post-service'
import { MessageCircleOffIcon } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'
import CommentItem from './comment-item'

type Props = { post: PostModel }

export default function CommentWrapper({ post }: Props) {
  const { isLoading, comments } = useGetPostComments(post.id)

  return (
    <View className='px-4'>
      <Text className='text-xl font-semibold text-jego-foreground mt-2 mb-5'>Commentaires</Text>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : comments.length === 0 ? (
        <Center className='w-full'>
          <VStack className='p-3 items-center' space='md'>
            <Icon as={MessageCircleOffIcon} className='text-jego-muted-foreground' style={{ width: 40, height: 40 }} />
            <Text className='text-sm text-jego-muted-foreground text-center'>
              Pas de commentaire pour le moment, soyez le premier à ajouter un commentaire.
            </Text>
          </VStack>
        </Center>
      ) : (
        <VStack space='xl'>
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </VStack>
      )}
    </View>
  )
}

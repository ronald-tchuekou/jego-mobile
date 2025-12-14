'use client'

import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Button, ButtonIcon } from '@/src/components/ui/button'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import { postCommentKey } from '@/src/lib/query-kye'
import { formatDate, getUserProfileImageUri } from '@/src/lib/utils'
import { Toast, ToastTitle, useToast } from '@/src/components/ui/toast'
import PostCommentResponseService, { PostCommentResponseModel } from '@/src/services/post-comment-response-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react-native'
import React from 'react'
import { Text } from 'react-native'
import { useAuthStore } from '@/src/stores/auth-store'
import { Menu, MenuItem, MenuItemLabel } from '@/src/components/ui/menu'
import { Icon } from '@/src/components/ui/icon'
import { useCommentStore } from '@/src/stores/comment-store'

type Props = { commentResponse: PostCommentResponseModel }

export default function CommentResponseItem({ commentResponse }: Props) {
  const auth = useAuthStore((s) => s.auth)
  const queryClient = useQueryClient()
  const toast = useToast()
  const isOwner = auth?.user?.id === commentResponse.userId

  const editComment = useCommentStore((s) => s.editComment)

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!auth?.token) throw new Error('Non autorisé.')
      return PostCommentResponseService.deleteOne(commentResponse.id, auth.token)
    },
    onSuccess: () => {
      toast.show({
        placement: 'top',
        render: () => (
          <Toast action='success'>
            <ToastTitle>Votre réponse a été supprimée.</ToastTitle>
          </Toast>
        ),
      })
      queryClient.invalidateQueries({ queryKey: postCommentKey.all }).then()
    },
  })

  const profileSrc = getUserProfileImageUri(commentResponse.user?.profileImage)

  return (
    <HStack space='sm' className='items-start'>
      <Avatar size='sm'>
        <AvatarImage source={profileSrc} />
      </Avatar>
      <VStack className='flex-1'>
        <HStack className='justify-between'>
          <VStack>
            <Text className='font-semibold text-base text-foreground'>{commentResponse.user.displayName}</Text>
            <Text className='text-xs text-muted-foreground'>{formatDate(commentResponse.createdAt)}</Text>
          </VStack>
          {isOwner && (
            <Menu
              placement={'bottom right'}
              trigger={({ ...props }) => (
                <Button {...props} size={'sm'} variant={'link'} className={'p-2'}>
                  <ButtonIcon as={MoreHorizontalIcon} className={'text-foreground'} />
                </Button>
              )}
            >
              <MenuItem textValue={'Modifier'} onPress={() => editComment(commentResponse)}>
                <Icon size={'sm'} as={PencilIcon} />
                <MenuItemLabel className={'ml-2'}>Modifier</MenuItemLabel>
              </MenuItem>
              <MenuItem textValue={'Supprimer'} onPress={() => deleteMutation.mutate()}>
                <Icon size={'sm'} as={Trash2Icon} className={'text-destructive'} />
                <MenuItemLabel className={'text-destructive ml-2'}>Supprimer</MenuItemLabel>
              </MenuItem>
            </Menu>
          )}
        </HStack>
        <Text className='text-sm text-foreground mt-1'>{commentResponse.comment}</Text>
      </VStack>
    </HStack>
  )
}

import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Button, ButtonIcon, ButtonText } from '@/src/components/ui/button'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { Menu, MenuItem, MenuItemLabel } from '@/src/components/ui/menu'
import { Toast, ToastTitle, useToast } from '@/src/components/ui/toast'
import { VStack } from '@/src/components/ui/vstack'
import { postCommentKey } from '@/src/lib/query-kye'
import { formatDate, getUserProfileImageUri } from '@/src/lib/utils'
import PostCommentService, { PostCommentModel } from '@/src/services/post-comment-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useCommentStore } from '@/src/stores/comment-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareMoreIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react-native'
import React from 'react'
import { Text } from 'react-native'
import { useShallow } from 'zustand/shallow'
import CommentResponseWrapper from './comment-response-wrapper'

type Props = { comment: PostCommentModel }

export default function CommentItem({ comment }: Props) {
  const auth = useAuthStore((s) => s.auth)
  const queryClient = useQueryClient()
  const toast = useToast()
  const isOwner = auth?.user?.id === comment.userId

  const { setParentId, editComment } = useCommentStore(
    useShallow((s) => ({
      setParentId: s.setParentId,
      editComment: s.editComment,
    })),
  )

  const [showReply, setShowReply] = React.useState(false)

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!auth?.token) throw new Error('Non autorisé.')
      return PostCommentService.deleteOne(comment.id, auth.token)
    },
    onSuccess: () => {
      toast.show({
        placement: 'top',
        render: () => (
          <Toast action='success'>
            <ToastTitle>Votre commentaire a été supprimé.</ToastTitle>
          </Toast>
        ),
      })
      queryClient.invalidateQueries({ queryKey: postCommentKey.all }).then()
    },
  })

  const profileSrc = getUserProfileImageUri(comment.user?.profileImage)

  return (
    <HStack space='sm' className='items-start'>
      <Avatar size='sm'>
        <AvatarImage source={profileSrc} />
      </Avatar>
      <VStack className='flex-1'>
        <HStack className='justify-between'>
          <VStack>
            <Text className='font-semibold text-base text-jego-foreground' numberOfLines={1}>
              {comment.user.displayName}
            </Text>
            <Text className='text-xs text-jego-muted-foreground'>{formatDate(comment.createdAt)}</Text>
          </VStack>
          {isOwner && (
            <Menu
              placement={'bottom right'}
              trigger={({ ...props }) => (
                <Button {...props} size={'sm'} variant={'link'} className={'p-2'}>
                  <ButtonIcon as={MoreHorizontalIcon} className={'text-jego-foreground'} />
                </Button>
              )}
            >
              <MenuItem textValue={'Modifier'} onPress={() => editComment(comment)}>
                <Icon size={'sm'} as={PencilIcon} />
                <MenuItemLabel className={'ml-2'}>Modifier</MenuItemLabel>
              </MenuItem>
              <MenuItem textValue={'Supprimer'} onPress={() => deleteMutation.mutate()}>
                <Icon size={'sm'} as={Trash2Icon} className={'text-jego-destructive'} />
                <MenuItemLabel className={'text-jego-destructive ml-2'}>Supprimer</MenuItemLabel>
              </MenuItem>
            </Menu>
          )}
        </HStack>

        <VStack className={'mt-1'}>
          <Text className='text-sm text-jego-foreground'>{comment.comment}</Text>
          <HStack className='gap-5'>
            <Button
              variant='link'
              action='secondary'
              size='sm'
              className={'h-7'}
              onPress={() => setShowReply(!showReply)}
            >
              <ButtonText size='sm'>Réponses</ButtonText>
              {showReply ? <ButtonIcon as={ChevronUpIcon} /> : <ButtonIcon as={ChevronDownIcon} />}
            </Button>
            <Button
              variant='link'
              action='secondary'
              size='sm'
              className={'h-7'}
              disabled={deleteMutation.isPending}
              onPress={() => setParentId(comment.id)}
            >
              <ButtonIcon as={MessageSquareMoreIcon} />
              <ButtonText size='sm'>Répondre</ButtonText>
            </Button>
          </HStack>
        </VStack>

        {showReply && <CommentResponseWrapper commentId={comment.id} />}
      </VStack>
    </HStack>
  )
}

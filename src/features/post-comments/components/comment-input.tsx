'use client'

import { Button, ButtonIcon, ButtonSpinner } from '@/src/components/ui/button'
import { HStack } from '@/src/components/ui/hstack'
import { PostModel } from '@/src/services/post-service'
import { SendIcon, XIcon } from 'lucide-react-native'
import React, { useEffect, useRef } from 'react'
import { Text, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSearchParams } from 'expo-router/build/hooks'
import { useCommentStore } from '@/src/stores/comment-store'
import { useShallow } from 'zustand/shallow'
import { useEditPostComment } from '@/src/features/post-comments/hooks/use-edit-post-comment'
import { VStack } from '@/src/components/ui/vstack'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'

type Props = { post: PostModel }

export function CommentInput({ post }: Props) {
  const inputRef = useRef<TextInput>(null)

  const insets = useSafeAreaInsets()
  const params = useSearchParams()
  const focus_comment = params.get('focus_comment')
  const { parentId, comment, clearState } = useCommentStore(
    useShallow((s) => ({
      parentId: s.parentId,
      comment: s.comment,
      clearState: s.clearState,
    })),
  )

  const [value, setValue] = React.useState('')

  const { createPostComment, editPostComment, isEditingPostComment, isCreatingPostComment } = useEditPostComment({
    onSuccess() {
      setValue('')
      clearState()
    },
  })

  const handleSubmit = () => {
    if (comment) {
      editPostComment({ id: comment.id, comment: value.trim(), isResponse: !!(comment as any).postCommentId })
    } else {
      createPostComment({ postId: post.id, comment: value.trim(), parentId })
    }
  }

  useEffect(() => {
    if (comment) {
      setValue(comment.comment)
    }
    if (comment || parentId) inputRef.current?.focus()
  }, [comment, parentId])

  return (
    <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
      <VStack
        style={{ paddingBottom: insets.bottom + 3 }}
        className={'p-4 border-t border-jego-input bg-jego-card'}
        space={'md'}
      >
        <HStack className={'justify-between w-full'}>
          <Text className={'text-lg font-medium text-jego-foreground'}>
            {parentId ? 'Répondre' : comment ? 'Modifier' : 'Commenter'}
          </Text>
          {(parentId || comment) && (
            <Button
              disabled={isCreatingPostComment || isEditingPostComment}
              action={'secondary'}
              className={'p-0 rounded-full'}
              style={{ width: 28, height: 28 }}
              onPress={() => {
                clearState()
                setValue('')
              }}
            >
              <ButtonIcon as={XIcon} size={'sm'} />
            </Button>
          )}
        </HStack>
        <HStack space={'md'} className={'items-end'}>
          <TextInput
            ref={inputRef}
            multiline
            numberOfLines={7}
            className={
              'flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-600 border-jego-border border rounded-xl text-jego-foreground'
            }
            placeholder={'Taper votre message...'}
            value={value}
            onChangeText={setValue}
            placeholderTextColor={'#9CA3AF'}
            style={{ fontSize: 14 }}
            textAlignVertical={'top'}
            autoFocus={!!focus_comment}
            autoCapitalize={'sentences'}
            autoCorrect={true}
          />
          <Button
            disabled={!value.trim() || isCreatingPostComment || isEditingPostComment}
            className={`rounded-full p-0 ${!value.trim() || isCreatingPostComment || isEditingPostComment ? 'opacity-50' : ''}`}
            style={{ height: 32, width: 32 }}
            onPress={handleSubmit}
          >
            {isCreatingPostComment || isEditingPostComment ? (
              <ButtonSpinner />
            ) : (
              <ButtonIcon as={SendIcon} className={'text-jego-primary-foreground'} />
            )}
          </Button>
        </HStack>
      </VStack>
    </KeyboardAvoidingView>
  )
}

'use client'

import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/src/components/ui/button'
import { HStack } from '@/src/components/ui/hstack'
import { VStack } from '@/src/components/ui/vstack'
import { useEditPostComment } from '@/src/features/post-comments/hooks/use-edit-post-comment'
import useGranularAnimation from '@/src/hooks/use-granular-animation'
import { PostModel } from '@/src/services/post-service'
import { useCommentStore } from '@/src/stores/comment-store'
import { useSearchParams } from 'expo-router/build/hooks'
import { SendIcon } from 'lucide-react-native'
import React, { useEffect, useRef } from 'react'
import { Keyboard, Text, TextInput } from 'react-native'
import { useAnimatedStyle } from 'react-native-reanimated'
import { AnimatedView } from 'react-native-reanimated/src/component/View'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/shallow'

type Props = { post: PostModel }

export function CommentInput({ post }: Props) {
  const inputRef = useRef<TextInput>(null)
  const insets = useSafeAreaInsets()

  const height = useGranularAnimation()
  const fakeView = useAnimatedStyle(() => ({ height: height.height.value - insets.bottom }))
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
      Keyboard.dismiss()
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
    <VStack className={'p-4 border-t border-input bg-card'}>
      <HStack className={'justify-between w-full mb-4'}>
        <Text className={'text-lg font-medium text-foreground'}>
          {parentId ? 'Répondre' : comment ? 'Modifier' : 'Commenter'}
        </Text>
        {(parentId || comment) && (
          <Button
            isDisabled={isCreatingPostComment || isEditingPostComment}
            action={'secondary'}
            onPress={() => {
              clearState()
              setValue('')
            }}
          >
            <ButtonText>Annuler la réponse</ButtonText>
          </Button>
        )}
      </HStack>
      <HStack space={'sm'} className={'items-end'}>
        <TextInput
          ref={inputRef}
          multiline
          numberOfLines={7}
          className={'flex-1 px-3 py-3 bg-input border-border border rounded-lg text-foreground'}
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
          size={'icon-lg'}
          isDisabled={!value.trim() || isCreatingPostComment || isEditingPostComment}
          onPress={handleSubmit}
        >
          {isCreatingPostComment || isEditingPostComment ? (
            <ButtonSpinner className={'text-primary-foreground'} />
          ) : (
            <ButtonIcon as={SendIcon} className={'text-primary-foreground'} />
          )}
        </Button>
      </HStack>
      <AnimatedView style={fakeView} />
    </VStack>
  )
}

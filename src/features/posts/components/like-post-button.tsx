import { Button, ButtonIcon, ButtonText } from '@/src/components/ui/button'
import usePostLike from '@/src/features/posts/hooks/use-post-like'
import { compactNumber } from '@/src/lib/utils'
import { PostModel } from '@/src/services/post-service'
import { HeartIcon } from 'lucide-react-native'
import { useState } from 'react'
import { cnBase } from 'tailwind-variants'

type Props = {
  post: PostModel
}

export function LikePostButton({ post }: Props) {
  const [likes, setLikes] = useState<number>(post.likeCount)
  const [isLiked, setIsLiked] = useState(false)

  const { deleteLike, createLike } = usePostLike(post.id, {
    onSuccess: (state) => {
      setIsLiked(state)
    },
  })

  const handleClick = () => {
    if (isLiked) {
      setLikes(s => s - 1)
      setIsLiked(false)
      deleteLike()
    } else {
      setLikes(s => s + 1)
      setIsLiked(true)
      createLike()
    }
  }

  return (
    <Button size='lg' variant='link' onPress={handleClick} className='px-4'>
      <ButtonText size='lg' className='text-jego-muted-foreground'>
        {compactNumber(likes)}
      </ButtonText>
      <ButtonIcon
        as={HeartIcon}
        className={cnBase(
          'stroke-jego-muted-foreground',
          isLiked ? 'fill-jego-primary stroke-jego-primary' : undefined,
        )}
      />
    </Button>
  )
}

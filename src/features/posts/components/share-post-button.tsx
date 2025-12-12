import { Button, ButtonIcon, ButtonText } from '@/src/components/ui/button'
import { env } from '@/src/lib/env'
import { compactNumber } from '@/src/lib/utils'
import { PostModel } from '@/src/services/post-service'
import PostShareService from '@/src/services/post-share-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useMutation } from '@tanstack/react-query'
import { ShareIcon } from 'lucide-react-native'
import { useState } from 'react'
import { Share } from 'react-native'
import { cnBase } from 'tailwind-variants'

type Props = {
  post: PostModel
  orientation?: 'horizontal' | 'vertical'
}

export function SharePostButton({ post, orientation = 'horizontal' }: Props) {
  const auth = useAuthStore((state) => state.auth)
  const [shares, setShares] = useState<number>(post.shareCount)

  const { isPending, mutate } = useMutation({
    mutationFn: async (postId: string) => {
      if (!auth?.token) throw new Error('Token not found')
      return PostShareService.createOne({ postId }, auth.token)
    },
  })

  const handleClick = async () => {
    await Share.share({
      title: 'Consulter un peut cette annonce !',
      message: "Voici le lien de l'annonce 👇",
      url: `${env.APP_URL}/posts/${post.id}`,
    })

    setShares((s) => s + 1)
    mutate(post.id)
  }

  if (orientation === 'vertical')
    return (
      <Button
        size='lg'
        variant='link'
        style={{ height: 50 }}
        onPress={handleClick}
        className='p-4 gap-0 flex-col items-center'
      >
        <ButtonIcon as={ShareIcon} className={cnBase('stroke-white ')} />
        <ButtonText size='lg' className='text-white'>
          {compactNumber(shares)}
        </ButtonText>
      </Button>
    )

  return (
    <Button size='lg' variant='link' onPress={handleClick} className='px-4' disabled={isPending}>
      <ButtonText size='lg' className='text-jego-muted-foreground'>
        {compactNumber(shares)}
      </ButtonText>
      <ButtonIcon as={ShareIcon} className={cnBase('stroke-jego-muted-foreground')} />
    </Button>
  )
}

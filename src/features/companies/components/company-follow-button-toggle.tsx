import { Button, ButtonText } from '@/src/components/ui/button'
import { Spinner } from '@/src/components/ui/spinner'
import { memo } from 'react'
import { cnBase } from 'tailwind-variants'
import useToggleFollowing from '../hooks/use-toggle-following'

type Props = {
  companyId: string
}

const CompanyFollowButtonToggle = ({ companyId }: Props) => {
  const { following, loadingFollowing, isPending, createFollowing, deleteFollowing } = useToggleFollowing(companyId)

  const handleClick = () => {
    if (following) deleteFollowing()
    else createFollowing()
  }

  return (
    <Button
      variant={'outline'}
      onPress={handleClick}
      disabled={isPending || loadingFollowing}
      className={'flex-none rounded-xl bg-jego-background border-jego-border'}
    >
      <Spinner
        className={cnBase('absolute left-1/2 top-1/2 translate-x-1/2 -translate-y-1/2', !isPending ? 'opacity-0' : '')}
      />
      <ButtonText className={cnBase('text-jego-foreground text-sm', isPending ? 'opacity-0' : '')}>
        {following ? 'Unfollow' : 'Follow'}
      </ButtonText>
    </Button>
  )
}

export default memo(CompanyFollowButtonToggle)

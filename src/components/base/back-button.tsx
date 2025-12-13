import { cn } from '@gluestack-ui/utils/nativewind-utils'
import { useRouter } from 'expo-router'
import { Button, ButtonIcon } from '../ui/button'
import { ArrowLeftIcon } from '../ui/icon'

type Props = {
  className?: string
  iconClassName?: string
}

export const BackButton = ({ className, iconClassName }: Props) => {
  const router = useRouter()

  return (
    <Button onPress={router.back} variant='link' action='default' size='icon-lg' className={cn(className)}>
      <ButtonIcon as={ArrowLeftIcon} size='xl' style={{ width: 24, height: 24 }} className={iconClassName} />
    </Button>
  )
}

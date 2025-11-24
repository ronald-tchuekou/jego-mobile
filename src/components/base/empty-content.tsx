import { CloudSnowIcon } from 'lucide-react-native'
import { ReactNode } from 'react'
import { Text } from 'react-native'
import { cnBase } from 'tailwind-variants'
import { Center } from '../ui/center'
import { Icon } from '../ui/icon'

type Props = {
  actionContent?: ReactNode
  text?: string
  className?: string
}

const EmptyContent = ({ text, actionContent, className }: Props) => {
  return (
    <Center className={cnBase('w-full min-h-[160px] gap-4', className)}>
      <Icon as={CloudSnowIcon} style={{ width: 80, height: 80 }} className={cnBase('text-jego-muted-foreground')} />
      <Text className={cnBase('text-center text-jego-muted-foreground text-base')}>
        {text ?? 'Pas de contenu disponible !'}
      </Text>
      {actionContent}
    </Center>
  )
}

export default EmptyContent

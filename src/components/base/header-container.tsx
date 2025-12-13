import { VStack } from '@/src/components/ui/vstack'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { cnBase } from 'tailwind-variants'
import React from 'react'

type Props = {
  withTopInset?: boolean
  className?: string
  children: React.ReactNode
}

export const HeaderContainer = ({ className, children, withTopInset = true }: Props) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      className={cnBase('bg-card border-b border-border', className)}
      style={{ paddingTop: withTopInset ? insets.top : 0 }}
    >
      <VStack className='p-4' space='md'>
        {children}
      </VStack>
    </View>
  )
}

import { isWeb, tva } from '@gluestack-ui/utils/nativewind-utils'

const baseStyle = isWeb ? 'flex flex-col relative z-0' : ''

export const cardStyle = tva({
  base: 'bg-jego-card text-jego-card-foreground border border-jego-input' + baseStyle,
  variants: {
    size: {
      sm: 'p-3 rounded-xl',
      md: 'p-4 rounded-xl',
      lg: 'p-6 rounded-2xl',
    },
    variant: {
      elevated: 'bg-jego-card',
      outline: 'border border-outline-200 ',
      ghost: 'rounded-none',
      filled: 'bg-background-50',
    },
  },
})

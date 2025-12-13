import { isWeb, tva } from '@gluestack-ui/utils/nativewind-utils'

const baseStyle = isWeb ? 'flex flex-col relative z-0' : ''

export const cardStyle = tva({
  base: 'bg-card text-card-foreground border border-border' + baseStyle,
  variants: {
    size: {
      sm: 'p-3 rounded-xl',
      md: 'p-4 rounded-xl',
      lg: 'p-6 rounded-2xl',
    },
    variant: {
      elevated: 'bg-card',
      outline: 'border border-border ',
      ghost: 'rounded-none',
      filled: 'bg-card',
    },
  },
})

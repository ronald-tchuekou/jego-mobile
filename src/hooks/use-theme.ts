import { useColorScheme } from 'nativewind'

const useTheme = () => {
  const { colorScheme } = useColorScheme()
  return colorScheme === 'dark' ? 'dark' : 'light'
}

export default useTheme

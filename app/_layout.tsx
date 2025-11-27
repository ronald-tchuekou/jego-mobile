import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider'
import '@/src/global.css'
import QueryProviders from '@/src/providers/query-provider'
import { useAuthStore } from '@/src/stores/auth-store'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'
import { KeyboardProvider } from 'react-native-keyboard-controller'

const AppStack = () => {
  const auth = useAuthStore((s) => s.auth)
  const { colorScheme } = useColorScheme()

  return (
    <>
      <Stack>
        <Stack.Protected guard={!!auth}>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='post/[post_id]' options={{ headerShown: false }} />
          <Stack.Screen name='post/video/[post_id]' options={{ headerShown: false }} />
          <Stack.Screen name='company/[company_id]' options={{ headerShown: false }} />
          <Stack.Screen name='chat/[conversation_id]' options={{ headerShown: false }} />
          <Stack.Screen name='appointments/edit/[company_id]' options={{ headerShown: false }} />
          <Stack.Screen name='profile/update-info' options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!auth}>
          <Stack.Screen name='login' options={{ headerShown: false }} />
          <Stack.Screen name='register' options={{ headerShown: false }} />
          <Stack.Screen name='forgot-password' options={{ headerShown: false }} />
          <Stack.Screen name='reset-password' options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  )
}

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <GluestackUIProvider>
        <QueryProviders>
          <AppStack />
        </QueryProviders>
      </GluestackUIProvider>
    </KeyboardProvider>
  )
}

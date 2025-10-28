import { Stack } from 'expo-router'

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import '@/global.css'
import QueryProviders from '@/providers/query-provider'
import { useAuthStore } from '@/stores/auth-store'

const AppStack = () => {
	const auth = useAuthStore((s) => s.auth)

	return (
		<Stack>
			<Stack.Protected guard={!!auth}>
				<Stack.Screen name='(tabs)' />
			</Stack.Protected>

			<Stack.Protected guard={!auth}>
				<Stack.Screen name='login' options={{ headerShown: false }} />
				<Stack.Screen name='register' options={{ headerShown: false }} />
			</Stack.Protected>
		</Stack>
	)
}

export default function RootLayout() {
	return (
		<GluestackUIProvider>
			<QueryProviders>
				<AppStack />
			</QueryProviders>
		</GluestackUIProvider>
	)
}

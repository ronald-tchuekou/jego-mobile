import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider'
import '@/src/global.css'
import QueryProviders from '@/src/providers/query-provider'
import { useAuthStore } from '@/src/stores/auth-store'
import { Stack } from 'expo-router'

const AppStack = () => {
	const auth = useAuthStore((s) => s.auth)

	return (
		<Stack>
			<Stack.Protected guard={!!auth}>
				<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
			</Stack.Protected>

			<Stack.Protected guard={!auth}>
				<Stack.Screen name='login' options={{ headerShown: false }} />
				<Stack.Screen name='register' options={{ headerShown: false }} />
				<Stack.Screen name='forgot-password' options={{ title: 'Mot de passe oublié' }} />
				<Stack.Screen name='reset-password' options={{ title: 'Réinitialiser le mot de passe' }} />
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

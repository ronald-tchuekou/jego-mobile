import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import "@/src/global.css";
import QueryProviders from "@/src/providers/query-provider";
import { useAuthStore } from "@/src/stores/auth-store";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'

const AppStack = () => {
	const auth = useAuthStore((s) => s.auth)
	const { colorScheme } = useColorScheme()

	return (
		<>
			<Stack>
				<Stack.Protected guard={!!auth}>
					<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
					<Stack.Screen name='posts/[post_id]' options={{ headerShown: false }} />
					<Stack.Screen name='companies/[company_id]' options={{ headerShown: false }} />
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
		<GluestackUIProvider>
			<QueryProviders>
				<AppStack />
			</QueryProviders>
		</GluestackUIProvider>
	)
}

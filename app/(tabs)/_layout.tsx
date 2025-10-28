import { IconSymbol } from '@/app-example/components/ui/icon-symbol.ios'
import { useAuthStore } from '@/src/stores/auth-store'
import { Tabs, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function AppLayout() {
	const auth = useAuthStore((s) => s.auth)
	const hydrated = useAuthStore((s) => s.hydrated)
	const router = useRouter()

	useEffect(() => {
		if (hydrated && !auth?.token) {
			router.replace('/login')
		}
	}, [auth, hydrated, router])

	if (!hydrated) {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator />
			</View>
		)
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => <IconSymbol size={28} name='house.fill' color={color} />,
				}}
			/>
			<Tabs.Screen
				name='jobs'
				options={{
					title: 'Explore',
					tabBarIcon: ({ color }) => <IconSymbol size={28} name='paperplane.fill' color={color} />,
				}}
			/>
		</Tabs>
	)
}

import { Icon } from '@/src/components/ui/icon'
import { Spinner } from '@/src/components/ui/spinner'
import { useAuthStore } from '@/src/stores/auth-store'
import { Tabs, useRouter } from 'expo-router'
import {
	BriefcaseBusinessIcon,
	Building2Icon,
	CircleUserRoundIcon,
	ListTodoIcon,
	MessageCircleMoreIcon,
} from 'lucide-react-native'
import { useEffect } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
				<Spinner size='large' />
			</View>
		)
	}

	return (
		<SafeAreaView className='flex-1' edges={['top']}>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: 'rgb(231, 0, 11)',
					headerShown: false,
				}}
			>
				<Tabs.Screen
					name='index'
					options={{
						title: 'Annonces',
						tabBarIcon: ({ color }) => <Icon as={ListTodoIcon} size='xl' color={color} />,
					}}
				/>
				<Tabs.Screen
					name='companies'
					options={{
						title: 'Entreprises',
						tabBarIcon: ({ color }) => <Icon as={Building2Icon} size='xl' color={color} />,
					}}
				/>
				<Tabs.Screen
					name='jobs'
					options={{
						title: 'Jobs',
						tabBarIcon: ({ color }) => <Icon as={BriefcaseBusinessIcon} size='xl' color={color} />,
					}}
				/>
				<Tabs.Screen
					name='chat'
					options={{
						title: 'Messages',
						tabBarIcon: ({ color }) => <Icon as={MessageCircleMoreIcon} size='xl' color={color} />,
					}}
				/>
				<Tabs.Screen
					name='profile'
					options={{
						title: 'Profil',
						tabBarIcon: ({ color }) => <Icon as={CircleUserRoundIcon} size='xl' color={color} />,
					}}
				/>
			</Tabs>
		</SafeAreaView>
	)
}

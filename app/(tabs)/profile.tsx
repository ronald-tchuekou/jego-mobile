import { VStack } from '@/src/components/ui/vstack'
import { LogoutButton } from '@/src/features/auth/components/logout-button'
import { Text } from 'react-native'

export default function ProfileScreen() {
	return (
		<VStack className='p-3' space='md'>
			<Text className='text-2xl font-bold'>Compte screen.</Text>
			<LogoutButton />
		</VStack>
	)
}

import { Alert, AlertIcon, AlertText } from '@/src/components/ui/alert'
import { Box } from '@/src/components/ui/box'
import { HStack } from '@/src/components/ui/hstack'
import { InfoIcon } from '@/src/components/ui/icon'
import { VStack } from '@/src/components/ui/vstack'
import { LogoutButton } from '@/src/features/auth/components/logout-button'
import { Text } from 'react-native'

export default function Index() {
	return (
		<VStack className='p-3' space='md'>
			<Text className='text-2xl font-bold'>This is my first screen.</Text>
			<HStack space='md' reversed={false} className='flex-wrap'>
				<Box className='h-16 w-16 bg-primary-300' />
				<Box className='h-16 w-16 bg-primary-400' />
				<Box className='h-16 w-16 bg-primary-500' />
				<Box className='h-16 w-16 bg-primary-300' />
				<Box className='h-16 w-16 bg-primary-400' />
				<Box className='h-16 w-16 bg-primary-500' />
				<Box className='h-16 w-16 bg-primary-300' />
				<Box className='h-16 w-16 bg-primary-400' />
				<Box className='h-16 w-16 bg-primary-500' />
				<Box className='h-16 w-16 bg-primary-300' />
				<Box className='h-16 w-16 bg-primary-400' />
				<Box className='h-16 w-16 bg-primary-500' />
				<Box className='h-16 w-16 bg-primary-300' />
				<Box className='h-16 w-16 bg-primary-400' />
				<Box className='h-16 w-16 bg-primary-500' />
			</HStack>
			<Alert action='error' variant='outline' className='rounded-lg'>
				<AlertIcon as={InfoIcon} />
				<AlertText>Description of alert!</AlertText>
			</Alert>
			<LogoutButton />
		</VStack>
	)
}

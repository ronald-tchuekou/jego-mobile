import { Alert, AlertIcon, AlertText } from '@/components/ui/alert'
import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { InfoIcon } from '@/components/ui/icon'
import { VStack } from '@/components/ui/vstack'
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
			<Button variant='solid' size='md' action='primary'>
				<ButtonText>Click me</ButtonText>
			</Button>
		</VStack>
	)
}

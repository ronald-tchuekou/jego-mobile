import { VStack } from "@/src/components/ui/vstack";
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { Text } from "react-native";

export default function ProfileScreen() {
	const height = getStatusBarHeight()

	return (
		<VStack className='flex-1 bg-jego-background'>
			<VStack
				className='px-4 pb-4 bg-jego-card border-b border-jego-border'
				space='md'
				style={{ paddingTop: height + 10 }}
			>
				<Text className='text-3xl font-bold text-jego-card-foreground'>Gestion du compte</Text>
			</VStack>
		</VStack>
	)
}

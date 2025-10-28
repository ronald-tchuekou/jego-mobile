import { useRouter } from "expo-router"
import { Button, ButtonIcon } from "../ui/button"
import { ArrowLeftIcon } from "../ui/icon"

export const BackButton = () => {
   const router = useRouter()

   return (
		<Button
			onPress={router.back}
			variant='solid'
			action='secondary'
			size='sm'
			className='rounded-full bg-transparent'
		>
			<ButtonIcon as={ArrowLeftIcon} size='xl' />
		</Button>
	)
}

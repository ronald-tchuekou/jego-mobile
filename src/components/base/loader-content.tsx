import { Center } from "../ui/center"
import { Spinner } from "../ui/spinner"

export const LoaderContent = () => {
  return (
    <Center className="min-h-32 w-full">
      <Spinner size={'large'} className='text-jego-primary' />
    </Center>
  )
}
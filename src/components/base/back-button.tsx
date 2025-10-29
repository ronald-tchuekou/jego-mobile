import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { useRouter } from "expo-router";
import { Button, ButtonIcon } from "../ui/button";
import { ArrowLeftIcon } from "../ui/icon";

type Props = {
  className?: string;
};

export const BackButton = ({ className }: Props) => {
  const router = useRouter();

  return (
		<Button
			onPress={router.back}
			variant='solid'
			action='secondary'
			size='sm'
			className={cn('rounded-full bg-transparent w-12 h-12', className)}
		>
			<ButtonIcon as={ArrowLeftIcon} size='xl' style={{ width: 30, height: 30 }} />
		</Button>
  )
};

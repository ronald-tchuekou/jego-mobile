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
			className={cn('rounded-full bg-transparent w-10 h-10', className)}
		>
			<ButtonIcon as={ArrowLeftIcon} size='xl' style={{ width: 24, height: 24 }} />
		</Button>
  )
};

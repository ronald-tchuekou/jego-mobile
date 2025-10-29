"use client";

import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import usePostShare from "@/src/features/posts/hooks/use-post-share";
import { env } from "@/src/lib/env";
import { compactNumber } from "@/src/lib/utils";
import { PostModel } from "@/src/services/post-service";
import { ShareIcon } from "lucide-react-native";
import { useState } from "react";
import { Share } from "react-native";
import { cnBase } from "tailwind-variants";

type Props = {
  post: PostModel;
};

export function SharePostButton({ post }: Props) {
  const [shares, setShares] = useState<number>(post.shareCount);

  const { loadingShare, isPending, createShare, share } = usePostShare(post.id);

  const handleClick = async () => {
		if (!share) {
			await Share.share({
				title: 'Consulter un peut cette annonce !',
				message: "Voici le lien de l'annonce 👇",
				url: `${env.APP_URL}/posts/${post.id}`,
      })
      
			setShares(shares + 1)
			createShare()
		}
  }

  return (
		<Button size="lg" variant='link' onPress={handleClick} className='px-4' disabled={isPending || loadingShare}>
			<ButtonIcon as={ShareIcon} className={cnBase('stroke-jego-muted-foreground')} />
			<ButtonText size="sm" className="text-jego-muted-foreground">{compactNumber(shares)}</ButtonText>
		</Button>
  )
}

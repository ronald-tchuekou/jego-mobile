import { Avatar, AvatarImage } from "@/src/components/ui/avatar";
import { Card } from "@/src/components/ui/card";
import { HStack } from "@/src/components/ui/hstack";
import { Image } from "@/src/components/ui/image";
import { VStack } from "@/src/components/ui/vstack";
import { env } from "@/src/lib/env";
import { IMAGES } from "@/src/lib/images";
import { formatDate } from "@/src/lib/utils";
import { PostModel } from "@/src/services/post-service";
import { Text } from "react-native";

export default function PostItem({ item }: { item: PostModel }) {
  const company = item.user?.company;
  const companyLogo = company?.logo
    ? { uri: `${env.API_URL}/v1/${company?.logo}` }
    : IMAGES.default_company_logo;
  const medias = item.medias;
  const mediaType = item.mediaType;
  const media = medias[0];

  const imageUrl = media.url.startsWith("http")
    ? media.url
    : `${env.API_URL}/v1/${media.url}`;

  return (
    <Card className="rounded-lg p-0">
      <HStack space="md" className="p-4">
        <Avatar size="md">
          <AvatarImage source={companyLogo} />
        </Avatar>
        <VStack className="flex-1">
          <Text className="font-semibold text-base text-jego-foreground">
            {company?.name}
          </Text>
          <Text className="text-sm text-typography-600">
            {formatDate(item.createdAt)}
          </Text>
        </VStack>
      </HStack>
      {mediaType === "image" && media && (
        <Image
          source={{ uri: imageUrl }}
          style={
            media.metadata?.aspectRatio
              ? { aspectRatio: media.metadata?.aspectRatio }
              : undefined
          }
          className={`w-full h-[400px] bg-black mb-4 ${media.metadata?.aspectRatio ? `aspect-${media.metadata.aspectRatio}` : "aspect-video"}`}
          resizeMode="contain"
          alt={media.name || "Media"}
        />
      )}
      <Text
        className="text-sm text-jego-muted-foreground px-4 pb-4"
        numberOfLines={3}
      >
        {item.description}
      </Text>
    </Card>
  );
}

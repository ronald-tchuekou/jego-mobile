import { Image } from "@/src/components/ui/image";
import { IMAGES } from "@/src/lib/images";
import { getImageLink } from "@/src/lib/utils";
import { CompanyModel } from "@/src/services/company-service";
import { Text } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { cnBase } from "tailwind-variants";

type Props = {
  company: CompanyModel;
  className?: string;
};

export const CompanyImageBanner = ({ company, className }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const companyImageBanner = company?.bannerImage
    ? getImageLink(company.bannerImage)
    : IMAGES.default_company_banner_image;

  return (
    <View className={cnBase('block relative w-full overflow-hidden bg-jego-accent border-b aspect-[4/1]', className)}>
      {hasError ? (
        <View className='absolute inset-0 bg-muted flex items-center justify-center'>
          <Text className='text-muted-foreground text-xs md:text-sm text-center p-4'>
            Erreur lors du chargement de l&apos;image
          </Text>
        </View>
      ) : (
        <Image
          src={companyImageBanner}
          alt={company.name}
          className={cnBase(
            'transition-opacity duration-300 w-full object-cover object-center aspect-[4/1]',
            isLoading ? 'opacity-0' : 'opacity-100',
          )}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            setIsLoading(false)
            setHasError(true)
          }}
          height={200}
          width={400}
        />
      )}
    </View>
  )
};

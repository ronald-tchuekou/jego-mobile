import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Button, ButtonText } from '@/src/components/ui/button'
import { Card } from '@/src/components/ui/card'
import { Center } from '@/src/components/ui/center'
import { Spinner } from '@/src/components/ui/spinner'
import { VStack } from '@/src/components/ui/vstack'
import { getUserProfileImageUri } from '@/src/lib/utils'
import UserService from '@/src/services/user-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useMutation } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'
import { Alert, Text } from 'react-native'

export const ProfileImage = () => {
  const auth = useAuthStore((state) => state.auth)
  const revalidate = useAuthStore((state) => state.revalidate)
  const profileImage = getUserProfileImageUri(auth?.user?.profileImage)

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: { image: ImagePicker.ImagePickerAsset; token?: string }) => {
      const { image, token } = formData

      if (!token) {
        throw new Error('Token is required')
      }

      const ext = image?.uri.split('.').pop()
      const file: any = {
        uri: image?.uri,
        name: new Date().getTime() + '.' + ext,
        type: `image/${ext}`,
      }

      return UserService.updateMeImageProfile(file, token)
    },
    onSuccess: () => {
      revalidate()
    },
    onError: (error) => {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la mise à jour de votre photo de profil')
    },
  })

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.')
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [2, 2],
      quality: 1,
    })

    const image = result.assets?.[0]
    if (!result.canceled && image) {
      mutate({ image, token: auth?.token })
    }
  }

  return (
    <Card>
      <VStack space='lg'>
        <VStack>
          <Text className='text-lg font-bold text-jego-foreground'>Photo de profil</Text>
          <Text className='text-sm text-jego-muted-foreground'>Mettez à jour votre photo de profil</Text>
        </VStack>
        <Avatar size='2xl' className='mx-auto relative'>
          <AvatarImage source={profileImage} />
          {isPending && (
            <Center className='absolute inset-0 bg-black/20 rounded-full'>
              <Spinner className='text-jego-primary' />
            </Center>
          )}
        </Avatar>
        <Text className='text-sm text-jego-muted-foreground text-center'>
          Formats acceptés: JPEG, PNG, WebP {'\n'}Taille maximale: 2MB
        </Text>
        <Button disabled={isPending} className='bg-jego-primary rounded-lg' onPress={pickImage}>
          <ButtonText className='text-jego-primary-foreground'>Changer la photo de profil</ButtonText>
        </Button>
      </VStack>
    </Card>
  )
}

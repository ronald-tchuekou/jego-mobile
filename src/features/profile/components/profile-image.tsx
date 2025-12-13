import { Avatar, AvatarImage } from '@/src/components/ui/avatar'
import { Box } from '@/src/components/ui/box'
import { Button, ButtonText } from '@/src/components/ui/button'
import { Card } from '@/src/components/ui/card'
import { Center } from '@/src/components/ui/center'
import { Spinner } from '@/src/components/ui/spinner'
import { VStack } from '@/src/components/ui/vstack'
import { copyToClipboard, getUserProfileImageUri } from '@/src/lib/utils'
import UserService from '@/src/services/user-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { useMutation } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'
import { Text } from 'react-native'
import Toast from 'react-native-toast-message'

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
      Toast.show({
        text1: 'Une erreur est survenue',
        text2: error.message || 'Une erreur est survenue lors de la mise à jour de votre photo de profil',
        type: 'error',
        visibilityTime: 6000,
      })
    },
  })

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permissionResult.granted) {
      Toast.show({
        text1: 'Permission required',
        text2: 'Permission to access the media library is required.',
        type: 'error',
        visibilityTime: 6000,
      })
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
          <Text className='text-lg font-bold text-foreground'>Photo de profil</Text>
          <Text className='text-sm text-muted-foreground'>Mettez à jour votre photo de profil</Text>
        </VStack>
        <Avatar size='2xl' className='mx-auto relative'>
          <AvatarImage source={profileImage} />
          {isPending && (
            <Center className='absolute inset-0 bg-black/20 rounded-full'>
              <Spinner className='text-primary' />
            </Center>
          )}
        </Avatar>
        <Box>
          <Text selectable className='text-center text-lg font-bold text-foreground'>
            {auth?.user?.displayName}
          </Text>
          <Text
            onPress={() => {
              if (auth?.user?.email) copyToClipboard(auth.user.email)
            }}
            selectable
            className='text-center text-sm text-muted-foreground'
          >
            {auth?.user?.email}
          </Text>
        </Box>
        <Text className='text-sm text-muted-foreground text-center'>
          Formats acceptés: JPEG, PNG, WebP {'\n'}Taille maximale: 2MB
        </Text>
        <Button isDisabled={isPending} className='bg-primary rounded-full' onPress={pickImage}>
          <ButtonText className='text-primary-foreground'>Changer la photo de profil</ButtonText>
        </Button>
      </VStack>
    </Card>
  )
}

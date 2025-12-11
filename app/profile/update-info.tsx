import { BackButton } from '@/src/components/base/back-button'
import { Button, ButtonSpinner, ButtonText } from '@/src/components/ui/button'
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText
} from '@/src/components/ui/form-control'
import { HStack } from '@/src/components/ui/hstack'
import { Input, InputField } from '@/src/components/ui/input'
import { VStack } from '@/src/components/ui/vstack'
import {
  defaultUpdateUserInfoValue,
  updateUserInfoSchema,
  type UpdateUserInfoSchema
} from '@/src/features/profile/schemas/update-user-info-schema'
import UserService from '@/src/services/user-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { AlertCircleIcon } from 'lucide-react-native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, Text, View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

export default function UpdateUserInfoScreen() {
  const router = useRouter()
  const auth = useAuthStore((s) => s.auth)
  const user = auth?.user
  const revalidate = useAuthStore((s) => s.revalidate)

  const form = useForm<UpdateUserInfoSchema>({
    resolver: zodResolver(updateUserInfoSchema),
    defaultValues: user
      ? {
          firstName: auth.user.firstName || '',
          lastName: auth.user.lastName || '',
          phone: auth.user.phone || '',
          address: auth.user.address || '',
          city: auth.user.city || '',
          state: auth.user.state || '',
          zipCode: auth.user.zipCode || '',
          country: auth.user.country || '',
        }
      : defaultUpdateUserInfoValue,
  })
  const {
    formState: { errors },
  } = form

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: UpdateUserInfoSchema) => {
      if (!auth?.token) throw new Error('Token manquant')
      return UserService.updateMe(body, auth.token)
    },
    onSuccess: () => {
      revalidate()
      Toast.show({
        text1: 'Succès',
        text2: 'Vos informations ont été mises à jour.',
        type: 'success',
        visibilityTime: 6000,
      })
      router.back()
    },
    onError: (error: any) => {
      Toast.show({
        text1: 'Une erreur est survenue',
        text2: error?.message || 'Une erreur est survenue lors de la mise à jour de vos informations.',
        type: 'error',
        visibilityTime: 6000,
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => mutate(data))

  return (
    <SafeAreaView style={{ flex: 1 }} className='bg-jego-card'>
      <HStack space='md' className='p-4 bg-jego-card border-b border-jego-border'>
        <BackButton />
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-jego-foreground' numberOfLines={1}>
            Information personnelles
          </Text>
          <Text className='text-sm text-jego-muted-foreground'>Mettez à jour vos informations de profil.</Text>
        </VStack>
      </HStack>
      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps='handled'
          className='flex-1 bg-jego-background'
          contentContainerClassName='p-4 bg-jego-background'
        >
          <VStack space='lg'>
            <Controller
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.firstName} size='md' isRequired>
                  <FormControlLabel>
                    <FormControlLabelText>Prénom</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='firstName'
                      placeholder='Prénom'
                      value={field.value}
                      onChangeText={field.onChange}
                      autoCapitalize='words'
                      autoCorrect={false}
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('lastName')}
                      autoFocus={true}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.firstName?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.lastName} size='md' isRequired>
                  <FormControlLabel>
                    <FormControlLabelText>Nom</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='lastName'
                      placeholder='Nom'
                      value={field.value}
                      onChangeText={field.onChange}
                      autoCapitalize='words'
                      autoCorrect={false}
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('phone')}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.lastName?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.phone} size='md'>
                  <FormControlLabel>
                    <FormControlLabelText>Téléphone</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='phone'
                      placeholder='Téléphone'
                      value={field.value}
                      onChangeText={field.onChange}
                      keyboardType='phone-pad'
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('address')}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.phone?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.address} size='md'>
                  <FormControlLabel>
                    <FormControlLabelText>Adresse</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='address'
                      placeholder='Adresse'
                      value={field.value}
                      onChangeText={field.onChange}
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('city')}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.address?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name='city'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.city} size='md'>
                  <FormControlLabel>
                    <FormControlLabelText>Ville</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='city'
                      placeholder='Ville'
                      value={field.value}
                      onChangeText={field.onChange}
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('state')}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.city?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name='state'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.state} size='md'>
                  <FormControlLabel>
                    <FormControlLabelText>Région/État</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='state'
                      placeholder='Région/État'
                      value={field.value}
                      onChangeText={field.onChange}
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('zipCode')}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.state?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name='zipCode'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.zipCode} size='md'>
                  <FormControlLabel>
                    <FormControlLabelText>Code postal</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='zipCode'
                      placeholder='Code postal'
                      value={field.value}
                      onChangeText={field.onChange}
                      keyboardType='numeric'
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('country')}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.zipCode?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.country} size='md'>
                  <FormControlLabel>
                    <FormControlLabelText>Pays</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='country'
                      placeholder='Pays'
                      value={field.value}
                      onChangeText={field.onChange}
                      returnKeyType='done'
                      onSubmitEditing={onSubmit}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.country?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />
          </VStack>
          <View className='h-20' />
        </ScrollView>
        <View className='px-4 py-2 bg-jego-card border-t border-jego-border' style={{ paddingBottom: 12 }}>
          <Button
            action='primary'
            variant='solid'
            size='lg'
            onPress={onSubmit}
            isDisabled={isPending}
            className='rounded-full mt-2 bg-jego-primary'
          >
            {isPending && <ButtonSpinner className='text-jego-primary-foreground' />}
            <ButtonText className='text-jego-primary-foreground'>Mettre à jour</ButtonText>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

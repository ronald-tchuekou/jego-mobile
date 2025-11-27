import { BackButton } from '@/src/components/base/back-button'
import { Button, ButtonSpinner, ButtonText } from '@/src/components/ui/button'
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/src/components/ui/form-control'
import { HStack } from '@/src/components/ui/hstack'
import { Input, InputField, InputIcon, InputSlot } from '@/src/components/ui/input'
import { VStack } from '@/src/components/ui/vstack'
import {
  defaultUpdatePasswordValue,
  type UpdatePasswordSchema,
  updatePasswordSchema,
} from '@/src/features/profile/schemas/update-password-schema'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import UserService from '@/src/services/user-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react-native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, Platform, ScrollView, Text, View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'

export default function UpdatePasswordScreen() {
  const height = getStatusBarHeight()
  const router = useRouter()
  const auth = useAuthStore((s) => s.auth)
  const revalidate = useAuthStore((s) => s.revalidate)

  const [showCurrent, setShowCurrent] = React.useState(false)
  const [showNew, setShowNew] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)

  const form = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: defaultUpdatePasswordValue,
  })
  const {
    formState: { errors },
  } = form

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: UpdatePasswordSchema) => {
      if (!auth?.token) throw new Error('Token manquant')
      return UserService.updateMePassword(body, auth.token)
    },
    onSuccess: async () => {
      await revalidate()
      Alert.alert('Succès', 'Votre mot de passe a été mis à jour.')
      router.back()
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error?.message || 'Une erreur est survenue lors de la mise à jour du mot de passe.')
    },
  })

  const onSubmit = form.handleSubmit((data) => mutate(data))

  return (
    <View style={{ flex: 1 }} className='bg-jego-background'>
      <HStack space='md' className='p-4 bg-jego-card border-b border-jego-border' style={{ paddingTop: height + 10 }}>
        <BackButton />
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-jego-foreground' numberOfLines={1}>
            Changer le mot de passe
          </Text>
          <Text className='text-sm text-jego-muted-foreground'>
            Entrez votre mot de passe actuel et votre nouveau mot de passe.
          </Text>
        </VStack>
      </HStack>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps='handled' className='flex-1' contentContainerClassName='p-4'>
          <VStack space='lg'>
            <Controller
              control={form.control}
              name='currentPassword'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.currentPassword} size='md' isRequired>
                  <FormControlLabel>
                    <FormControlLabelText>Mot de passe actuel</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='currentPassword'
                      placeholder='Mot de passe actuel'
                      value={field.value}
                      onChangeText={field.onChange}
                      secureTextEntry={!showCurrent}
                      autoCapitalize='none'
                      autoCorrect={false}
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('newPassword')}
                    />
                    <InputSlot className='pr-3' onPress={() => setShowCurrent((v) => !v)}>
                      <InputIcon as={showCurrent ? EyeIcon : EyeOffIcon} className='text-jego-muted-foreground' />
                    </InputSlot>
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.currentPassword?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.newPassword} size='md' isRequired>
                  <FormControlLabel>
                    <FormControlLabelText>Nouveau mot de passe</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='newPassword'
                      placeholder='Nouveau mot de passe'
                      value={field.value}
                      onChangeText={field.onChange}
                      secureTextEntry={!showNew}
                      autoCapitalize='none'
                      autoCorrect={false}
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('confirmNewPassword')}
                    />
                    <InputSlot className='pr-3' onPress={() => setShowNew((v) => !v)}>
                      <InputIcon as={showNew ? EyeIcon : EyeOffIcon} className='text-jego-muted-foreground' />
                    </InputSlot>
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.newPassword?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name='confirmNewPassword'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.confirmNewPassword} size='md' isRequired>
                  <FormControlLabel>
                    <FormControlLabelText>Confirmer le nouveau mot de passe</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='confirmNewPassword'
                      placeholder='Confirmer le mot de passe'
                      value={field.value}
                      onChangeText={field.onChange}
                      secureTextEntry={!showConfirm}
                      autoCapitalize='none'
                      autoCorrect={false}
                      returnKeyType='done'
                      onSubmitEditing={onSubmit}
                    />
                    <InputSlot className='pr-3' onPress={() => setShowConfirm((v) => !v)}>
                      <InputIcon as={showConfirm ? EyeIcon : EyeOffIcon} className='text-jego-muted-foreground' />
                    </InputSlot>
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.confirmNewPassword?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <Button
              action='primary'
              variant='solid'
              size='lg'
              onPress={onSubmit}
              isDisabled={isPending}
              className='rounded-lg mt-2 bg-jego-primary'
            >
              {isPending && <ButtonSpinner className='text-jego-primary-foreground' />}
              <ButtonText className='text-jego-primary-foreground'>Mettre à jour le mot de passe</ButtonText>
            </Button>
          </VStack>
          <View className='h-20' />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}



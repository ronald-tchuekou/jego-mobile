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
import { Input, InputField } from '@/src/components/ui/input'
import { VStack } from '@/src/components/ui/vstack'
import {
  defaultVerifyEmailChangeValue,
  type VerifyEmailChangeSchema,
  verifyEmailChangeSchema,
} from '@/src/features/profile/schemas/update-email-schema'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
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
import Toast from 'react-native-toast-message'

export default function VerifyEmailChangeScreen() {
  const height = getStatusBarHeight()
  const router = useRouter()
  const auth = useAuthStore((s) => s.auth)
  const revalidate = useAuthStore((s) => s.revalidate)

  const form = useForm<VerifyEmailChangeSchema>({
    resolver: zodResolver(verifyEmailChangeSchema),
    defaultValues: defaultVerifyEmailChangeValue,
  })
  const {
    formState: { errors },
  } = form

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: VerifyEmailChangeSchema) => {
      if (!auth?.token) throw new Error('Token manquant')
      return UserService.verifyNewEmail(body.verificationCode, auth.token)
    },
    onSuccess: async () => {
      await revalidate()
      Toast.show({
        text1: 'Succès',
        text2: 'Votre nouvelle adresse e-mail a été confirmée.',
        type: 'success',
        visibilityTime: 6000,
      })
      router.back()
    },
    onError: (error: any) => {
      Toast.show({
        text1: 'Une erreur est survenue',
        text2: error?.message || 'Code invalide. Veuillez réessayer.',
        type: 'error',
        visibilityTime: 6000,
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => mutate(data))

  return (
    <View style={{ flex: 1 }} className='bg-jego-background'>
      <HStack space='md' className='p-4 bg-jego-card border-b border-jego-border' style={{ paddingTop: height + 10 }}>
        <BackButton />
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-jego-foreground' numberOfLines={1}>
            Vérifier le changement d&apos;e-mail
          </Text>
          <Text className='text-sm text-jego-muted-foreground'>
            Entrez le code envoyé à votre nouvelle adresse e-mail.
          </Text>
        </VStack>
      </HStack>

      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps='handled' className='flex-1' contentContainerClassName='p-4'>
          <VStack space='lg'>
            <Controller
              control={form.control}
              name='verificationCode'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.verificationCode} size='md' isRequired>
                  <FormControlLabel>
                    <FormControlLabelText>Code de vérification</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='verificationCode'
                      placeholder='Ex: 123456'
                      value={field.value}
                      onChangeText={(text) => field.onChange(text.replace(/\\D/g, '').slice(0, 6))}
                      keyboardType='number-pad'
                      returnKeyType='done'
                      onSubmitEditing={onSubmit}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.verificationCode?.message}
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
              className='rounded-full mt-2 bg-jego-primary'
            >
              {isPending && <ButtonSpinner className='text-jego-primary-foreground' />}
              <ButtonText className='text-jego-primary-foreground'>Valider</ButtonText>
            </Button>
          </VStack>
          <View className='h-20' />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

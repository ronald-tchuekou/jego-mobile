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
import { AlertCircleIcon } from '@/src/components/ui/icon'
import { Image } from '@/src/components/ui/image'
import { Input, InputField } from '@/src/components/ui/input'
import { VStack } from '@/src/components/ui/vstack'
import {
  defaultForgotPasswordValue,
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from '@/src/features/auth/schemas/forgot-pass-schema'
import { IMAGES } from '@/src/lib/images'
import AuthService from '@/src/services/auth-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ForgotPasswordScreen() {
  const router = useRouter()

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: defaultForgotPasswordValue,
  })
  const {
    formState: { errors },
  } = form

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: ForgotPasswordSchema) => {
      return AuthService.forgotPassword(body.email)
    },
    onSuccess: () => {
      Alert.alert('Super !', 'Un lien de réinitialisation de votre mot de passe a été envoyé à votre adresse e-mail.', [
        { text: 'Me connecter', onPress: router.back, isPreferred: true },
      ])
    },
    onError: (error) => {
      Alert.alert(error.message)
    },
  })

  const onSubmit = form.handleSubmit((data) => mutate(data))

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-jego-background'>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerClassName='flex-1 items-center justify-center p-6'
        >
          <VStack space='md' className='w-full max-w-[420px]'>
            <Image source={IMAGES.splash} className='w-40 h-20 mx-auto mb-5' alt='Logo' />
            <Text className='text-3xl font-bold mb-4 text-center text-jego-foreground'>Mot de passe oublié</Text>

            <Text className='text-lg text-center text-jego-foreground'>
              Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe
            </Text>

            <Controller
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.email} size='md' isRequired>
                  <FormControlLabel>
                    <FormControlLabelText>Adresse email</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='lg' className='rounded-lg bg-jego-card'>
                    <InputField
                      inputMode='email'
                      keyboardType='email-address'
                      autoCapitalize='none'
                      autoCorrect={false}
                      placeholder='Adresse email'
                      value={field.value}
                      onChangeText={field.onChange}
                      onSubmitEditing={onSubmit}
                      returnKeyType='next'
                      autoFocus={true}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.email?.message}
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
              className='rounded-lg bg-jego-primary mt-2'
            >
              {isPending && <ButtonSpinner className='text-jego-primary-foreground' />}
              <ButtonText className='text-jego-primary-foreground'>Valider</ButtonText>
            </Button>

            <HStack space='sm'>
              <Text className='text-base text-jego-foreground'>Je me rappelle de mon mot de passe !</Text>
              <Text onPress={router.back} className='underline text-base text-jego-primary'>
                Me connecter
              </Text>
            </HStack>

            <View className='h-6' />
          </VStack>
        </ScrollView>
        <BackButton className='absolute top-4 left-4' />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

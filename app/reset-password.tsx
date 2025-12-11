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
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from '@/src/components/ui/icon'
import { Image } from '@/src/components/ui/image'
import { Input, InputField, InputIcon, InputSlot } from '@/src/components/ui/input'
import { VStack } from '@/src/components/ui/vstack'
import {
  defaultResetPasswordValue,
  resetPasswordSchema,
  ResetPasswordSchema,
} from '@/src/features/auth/schemas/reset-pass-schema'
import { IMAGES } from '@/src/lib/images'
import AuthService, { ResetPasswordBody } from '@/src/services/auth-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

export default function ResetPasswordScreen() {
  const login = useAuthStore((s) => s.login)
  const router = useRouter()

  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: defaultResetPasswordValue,
  })
  const {
    formState: { errors },
  } = form

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: ResetPasswordBody) => {
      return AuthService.resetPassword(body)
    },
    onSuccess: (data) => {
      login(data)
      router.replace('/(tabs)')
    },
    onError: (error) => {
      Toast.show({
        text1: 'Une erreur est survenue',
        text2: error.message,
        type: 'error',
        visibilityTime: 6000,
      })
    },
  })

  const onSubmit = form.handleSubmit((data) =>
    mutate({
      confirmPassword: data.passwordConfirmation,
      password: data.password,
      token: '',
      userId: '',
    }),
  )

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-jego-background'>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        bottomOffset={62}
        contentContainerClassName={'flex-1 items-center justify-center p-6'}
      >
        <VStack space='md' className='w-full max-w-[420px]'>
          <Image source={IMAGES.splash} className='w-40 h-20 mx-auto mb-5' alt='Logo' />
          <Text className='text-3xl font-bold mb-4 text-center text-jego-foreground'>
            Créer un nouveau mot de passe
          </Text>

          <Text className='text-lg text-center text-jego-foreground mb-3'>
            Assurez-vous que votre nouveau mot de passe est fort et sécurisé
          </Text>

          <Controller
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormControl isInvalid={!!errors.password} size='md' isRequired>
                <FormControlLabel>
                  <FormControlLabelText>Nouveau mot de passe</FormControlLabelText>
                </FormControlLabel>
                <Input size='lg' className='rounded-lg bg-jego-card' isInvalid={!!errors.password}>
                  <InputField
                    type={showPassword ? 'text' : 'password'}
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder='Mot de passe'
                    value={field.value}
                    onChangeText={field.onChange}
                    onSubmitEditing={onSubmit}
                    returnKeyType='done'
                  />
                  <InputSlot className='pr-3' onPress={handleState}>
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} className='text-jego-muted-foreground' />
                  </InputSlot>
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                  <FormControlErrorText className='text-jego-destructive'>
                    {errors.password?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}
          />

          <Controller
            control={form.control}
            name='passwordConfirmation'
            render={({ field }) => (
              <FormControl isInvalid={!!errors.passwordConfirmation} size='md' isRequired>
                <FormControlLabel>
                  <FormControlLabelText>Mot de passe de confirmation</FormControlLabelText>
                </FormControlLabel>
                <Input size='lg' className='rounded-lg bg-jego-card' isInvalid={!!errors.password}>
                  <InputField
                    type={showPassword ? 'text' : 'password'}
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder='Confirmation'
                    value={field.value}
                    onChangeText={field.onChange}
                    onSubmitEditing={onSubmit}
                    returnKeyType='done'
                  />
                  <InputSlot className='pr-3' onPress={handleState}>
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} className='text-jego-muted-foreground' />
                  </InputSlot>
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive' />
                  <FormControlErrorText className='text-jego-destructive'>
                    {errors.passwordConfirmation?.message}
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

          <View className='h-6' />
        </VStack>
        <BackButton className='absolute top-4 left-4' />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

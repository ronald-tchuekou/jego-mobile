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
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from '@/src/components/ui/icon'
import { Image } from '@/src/components/ui/image'
import { Input, InputField, InputIcon, InputSlot } from '@/src/components/ui/input'
import { VStack } from '@/src/components/ui/vstack'
import { defaultLoginFormValue, LoginSchema, loginSchema } from '@/src/features/auth/schemas/login-schema'
import { IMAGES } from '@/src/lib/images'
import AuthService from '@/src/services/auth-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login)
  const router = useRouter()

  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginFormValue,
  })
  const {
    formState: { errors },
  } = form

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: LoginSchema) => {
      return AuthService.login(body)
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

  const onSubmit = form.handleSubmit((data) => mutate(data))

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-background'>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        bottomOffset={62}
        contentContainerClassName={'flex-1 items-center justify-center p-6'}
      >
        <VStack space='md' className='w-full max-w-[420px]'>
          <Image source={IMAGES.splash} className='w-40 h-20 mx-auto mb-5' alt='Logo' />
          <Text className='text-3xl font-bold mb-4 text-center text-foreground'>Se connecter</Text>

          <Controller
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormControl isInvalid={!!errors.email} size='md' isRequired>
                <FormControlLabel>
                  <FormControlLabelText>Adresse email</FormControlLabelText>
                </FormControlLabel>
                <Input size='lg' className='rounded-lg bg-card'>
                  <InputField
                    ref={field.ref}
                    inputMode='email'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder='Adresse email'
                    value={field.value}
                    onChangeText={field.onChange}
                    onSubmitEditing={() => form.setFocus('password')}
                    returnKeyType='next'
                    autoFocus={true}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-destructive' />
                  <FormControlErrorText className='text-destructive'>{errors.email?.message}</FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}
          />

          <Controller
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormControl isInvalid={!!errors.password} size='md' isRequired>
                <HStack className='justify-between'>
                  <FormControlLabel>
                    <FormControlLabelText>Mot de passe</FormControlLabelText>
                  </FormControlLabel>
                  <Link href={'/forgot-password'} className='underline text-primary text-base'>
                    Mot de passe oublié ?
                  </Link>
                </HStack>
                <Input size='lg' className='rounded-lg bg-card' isInvalid={!!errors.password}>
                  <InputField
                    ref={field.ref}
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
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} className='text-muted-foreground' />
                  </InputSlot>
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-destructive' />
                  <FormControlErrorText className='text-destructive'>{errors.password?.message}</FormControlErrorText>
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
            className='rounded-full mt-2 bg-primary'
          >
            {isPending && <ButtonSpinner className='text-primary-foreground' />}
            <ButtonText className='text-primary-foreground'>Se connecter</ButtonText>
          </Button>

          <HStack space='sm'>
            <Text className='text-base text-foreground'>Vous n&apos;avez pas de compte ? </Text>
            <Link href='/register' className='underline text-base text-primary' replace>
              Créer un compte
            </Link>
          </HStack>

          <View className='h-6' />
        </VStack>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

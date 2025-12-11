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
  defaultUpdateEmailValue,
  type UpdateEmailSchema,
  updateEmailSchema,
} from '@/src/features/profile/schemas/update-email-schema'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import UserService from '@/src/services/user-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react-native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, Text, View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import Toast from 'react-native-toast-message'

export default function UpdateEmailScreen() {
  const height = getStatusBarHeight()
  const router = useRouter()
  const auth = useAuthStore((s) => s.auth)

  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<UpdateEmailSchema>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: auth?.user ? { email: auth.user.email || '', password: '' } : defaultUpdateEmailValue,
  })
  const {
    formState: { errors },
  } = form

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: UpdateEmailSchema) => {
      if (!auth?.token) throw new Error('Token manquant')
      return UserService.updateMeEmail(body, auth.token)
    },
    onSuccess: () => {
      Toast.show({
        text1: 'Vérification requise',
        text2:
          'Un code de vérification a été envoyé à votre nouvelle adresse e-mail. Veuillez le saisir pour confirmer le changement.',
        type: 'success',
        visibilityTime: 6000,
      })
      router.push('/profile/verify-email-change')
    },
    onError: (error: any) => {
      Toast.show({
        text1: 'Une erreur est survenue',
        text2: error?.message || "Une erreur est survenue lors de la mise à jour de l'adresse e-mail.",
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
            Changer votre adresse e-mail
          </Text>
          <Text className='text-sm text-jego-muted-foreground'>
            Entrez votre nouveau courriel et votre mot de passe.
          </Text>
        </VStack>
      </HStack>

      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps='handled' className='flex-1' contentContainerClassName='p-4'>
          <VStack space='lg'>
            <Controller
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.email} size='md' isRequired>
                  <FormControlLabel>
                    <FormControlLabelText>Nouvelle adresse e-mail</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='email'
                      placeholder='exemple@domaine.com'
                      value={field.value}
                      onChangeText={field.onChange}
                      autoCapitalize='none'
                      keyboardType='email-address'
                      autoCorrect={false}
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('password')}
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

            <Controller
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.password} size='md' isRequired>
                  <FormControlLabel>
                    <FormControlLabelText>Mot de passe actuel</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='password'
                      placeholder='Mot de passe'
                      value={field.value}
                      onChangeText={field.onChange}
                      secureTextEntry={!showPassword}
                      autoCapitalize='none'
                      autoCorrect={false}
                      returnKeyType='done'
                      onSubmitEditing={onSubmit}
                    />
                    <InputSlot className='pr-3' onPress={() => setShowPassword((v) => !v)}>
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

            <Button
              action='primary'
              variant='solid'
              size='lg'
              onPress={onSubmit}
              isDisabled={isPending}
              className='rounded-full mt-2 bg-jego-primary'
            >
              {isPending && <ButtonSpinner className='text-jego-primary-foreground' />}
              <ButtonText className='text-jego-primary-foreground'>Mettre à jour l&apos;e-mail</ButtonText>
            </Button>
          </VStack>
          <View className='h-20' />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

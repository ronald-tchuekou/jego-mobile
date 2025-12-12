import { BackButton } from '@/src/components/base/back-button'
import { Alert, AlertIcon, AlertText } from '@/src/components/ui/alert'
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
  defaultDeleteAccountValue,
  deleteAccountSchema,
  type DeleteAccountSchema,
} from '@/src/features/profile/schemas/delete-account-schema'
import UserService from '@/src/services/user-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { AlertCircleIcon, AlertTriangleIcon, EyeIcon, EyeOffIcon } from 'lucide-react-native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, Text, View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import Toast from 'react-native-toast-message'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderContainer } from '@/src/components/base/header-container'

export default function DeleteAccountScreen() {
  const router = useRouter()
  const auth = useAuthStore((s) => s.auth)
  const logout = useAuthStore((s) => s.logout)

  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<DeleteAccountSchema>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: defaultDeleteAccountValue,
  })
  const {
    formState: { errors },
  } = form

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: DeleteAccountSchema) => {
      if (!auth?.token) throw new Error('Token manquant')
      return UserService.deleteMe({ password: body.password }, auth.token)
    },
    onSuccess: () => {
      logout()
      router.replace('/login')
      Toast.show({
        text1: 'Compte supprimé',
        text2: 'Votre compte a été supprimé avec succès.',
        type: 'success',
      })
    },
    onError: (error: any) => {
      Toast.show({
        text1: 'Erreur',
        text2: error?.message || 'Une erreur est survenue lors de la suppression du compte.',
        type: 'error',
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => mutate(data))

  return (
    <SafeAreaView style={{ flex: 1 }} className='bg-jego-card'>
      <HeaderContainer withTopInset={false}>
        <HStack space='md'>
          <BackButton />
          <VStack className='flex-1'>
            <Text className='font-semibold text-base text-jego-foreground' numberOfLines={1}>
              Supprimer le compte
            </Text>
            <Text className='text-sm text-jego-muted-foreground'>Cette action est irréversible.</Text>
          </VStack>
        </HStack>
      </HeaderContainer>

      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps='handled'
          className='flex-1 bg-jego-background'
          contentContainerClassName='p-4 bg-jego-background'
        >
          <VStack space='lg'>
            <Controller
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.password} size='md' isRequired>
                  <FormControlLabel>
                    <FormControlLabelText>Mot de passe</FormControlLabelText>
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
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('confirmation')}
                    />
                    <InputSlot className='pr-3' onPress={() => setShowPassword((v) => !v)}>
                      <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} className='text-jego-muted-foreground' />
                    </InputSlot>
                  </Input>
                  <FormControlError className='items-start'>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive mt-1' />
                    <FormControlErrorText className='text-jego-destructive flex-1'>
                      {errors.password?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name='confirmation'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.confirmation} size='md' isRequired className='w-full'>
                  <FormControlLabel>
                    <FormControlLabelText>Tapez &quot;SUPPRIMER&quot; pour confirmer</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='xl' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      testID='confirmation'
                      placeholder='Tapez SUPPRIMER en majuscule'
                      value={field.value}
                      onChangeText={(v) => field.onChange(v)}
                      autoCapitalize='characters'
                      autoCorrect={false}
                      returnKeyType='done'
                      onSubmitEditing={onSubmit}
                    />
                  </Input>
                  <FormControlError className='items-start'>
                    <FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-jego-destructive mt-1' />
                    <FormControlErrorText className='text-jego-destructive flex-1'>
                      {errors.confirmation?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* Alert */}
            <Alert className='items-start bg-jego-destructive/10' action='error' variant='solid'>
              <AlertIcon as={AlertTriangleIcon} size='lg' />
              <AlertText size='sm' className='flex-1'>
                <Text className='font-bold text-base'>
                  Attention : Que se passe-t-il quand vous supprimez votre compte ?
                </Text>
                {'\n'}• Votre profil et toutes vos données personnelles seront supprimés.{'\n'}• Vos publications,
                commentaires et interactions seront supprimés,{'\n'}• Vous perdrez l&apos;accès à tous vos contenus et
                historiques.{'\n'}• Cette action ne peut pas être annulée.
              </AlertText>
            </Alert>

            <Button
              action='primary'
              variant='solid'
              size='lg'
              onPress={onSubmit}
              isDisabled={isPending}
              className='rounded-full mt-2 bg-jego-destructive'
            >
              {isPending && <ButtonSpinner className='text-jego-primary-foreground' />}
              <ButtonText className='text-jego-primary-foreground'>Supprimer mon compte</ButtonText>
            </Button>
          </VStack>
          <View className='h-20' />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

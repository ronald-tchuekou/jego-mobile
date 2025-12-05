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
  defaultEditAppointmentValue,
  editAppointmentSchema,
  EditAppointmentSchema,
} from '@/src/features/appointments/schemas/edit-appointment-schema'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import CompanyAppointmentRequestService from '@/src/services/company-appointment-request-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Platform, ScrollView, Text, View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

export default function EditAppointmentScreen() {
  const { company_id } = useLocalSearchParams<{ company_id: string }>()
  const height = getStatusBarHeight()
  const router = useRouter()
  const auth = useAuthStore((s) => s.auth)
  const queryClient = useQueryClient()
  const insets = useSafeAreaInsets()
  
  const form = useForm<EditAppointmentSchema>({
    resolver: zodResolver(editAppointmentSchema),
    defaultValues: { ...defaultEditAppointmentValue, companyId: company_id || '' },
  })

  const {
    formState: { errors },
  } = form

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: EditAppointmentSchema) => {
      if (!auth?.token || !auth?.user?.id) {
        throw new Error('Veuillez vous connecter pour continuer.')
      }
      return CompanyAppointmentRequestService.create({ ...body, userId: auth.user.id }, auth.token)
    },
    onSuccess: () => {
      // Optionally invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      Toast.show({
        type: 'success',
        text1: 'Rendez-vous envoyé',
        text2: 'Votre demande a été envoyée avec succès.',
      })
      router.back()
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Une erreur est survenue',
        text2: error?.message || 'Veuillez réessayer.',
        visibilityTime: 6000,
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => mutate(data))

  return (
    <View className='flex-1 bg-jego-background'>
      <HStack
        space='md'
        className='p-4 bg-jego-card border-b border-jego-border items-center'
        style={{ paddingTop: height + 10 }}
      >
        <BackButton />
        <Text className='font-semibold text-xl text-jego-foreground' numberOfLines={1}>
          Prendre rendez-vous
        </Text>
      </HStack>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps='handled' className='flex-1' contentContainerClassName='p-4'>
          <VStack space='md'>
            {/* Date */}
            <Controller
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.date} isRequired size='md'>
                  <FormControlLabel>
                    <FormControlLabelText>Date du rendez-vous (YYYY-MM-DD)</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='lg' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      placeholder='2025-12-31'
                      value={field.value}
                      onChangeText={field.onChange}
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('time')}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.date?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* Time */}
            <Controller
              control={form.control}
              name='time'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.time} isRequired size='md'>
                  <FormControlLabel>
                    <FormControlLabelText>Heure du rendez-vous (HH:mm)</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='lg' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      placeholder='14:30'
                      value={field.value}
                      onChangeText={field.onChange}
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('subject')}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.time?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* Subject */}
            <Controller
              control={form.control}
              name='subject'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.subject} isRequired size='md'>
                  <FormControlLabel>
                    <FormControlLabelText>Objet du rendez-vous</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='lg' className='rounded-lg bg-jego-card'>
                    <InputField
                      ref={field.ref}
                      placeholder="Entrez l'objet"
                      value={field.value}
                      onChangeText={field.onChange}
                      returnKeyType='next'
                      onSubmitEditing={() => form.setFocus('content')}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.subject?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* Content */}
            <Controller
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.content} isRequired size='md'>
                  <FormControlLabel>
                    <FormControlLabelText>Décrivez votre besoin</FormControlLabelText>
                  </FormControlLabel>
                  <Input size='lg' className='rounded-lg bg-jego-card h-[200px]'>
                    <InputField
                      ref={field.ref}
                      placeholder='Décrivez votre besoin, les services et autre...'
                      value={field.value}
                      onChangeText={field.onChange}
                      multiline
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText className='text-jego-destructive'>
                      {errors.content?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <View className='h-20'/>
          </VStack>
        </ScrollView>
        <View className='px-4 py-2 bg-jego-card border-t border-jego-border' style={{ paddingBottom: insets.bottom }}>
          <Button
            action='primary'
            variant='solid'
            size='lg'
            onPress={onSubmit}
            isDisabled={isPending}
            className='rounded-full mt-2 bg-jego-primary'
          >
            {isPending && <ButtonSpinner className='text-jego-primary-foreground' />}
            <ButtonText className='text-jego-primary-foreground'>Envoyer</ButtonText>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

import { BackButton } from '@/src/components/base/back-button'
import { DatePickerInput } from '@/src/components/base/date-picker-input'
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
import { Textarea, TextareaInput } from '@/src/components/ui/textarea'
import { VStack } from '@/src/components/ui/vstack'
import {
  defaultEditAppointmentValue,
  editAppointmentSchema,
  EditAppointmentSchema,
} from '@/src/features/appointments/schemas/edit-appointment-schema'
import { CompanyInfo } from '@/src/features/companies/components/company-info'
import { formatDate } from '@/src/lib/utils'
import CompanyAppointmentRequestService from '@/src/services/company-appointment-request-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import Toast from 'react-native-toast-message'
import { cnBase } from 'tailwind-variants'
import { appointmentKey } from '@/src/lib/query-kye'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderContainer } from '@/src/components/base/header-container'

export default function EditAppointmentScreen() {
  const { company_id } = useLocalSearchParams<{ company_id: string }>()
  const router = useRouter()
  const auth = useAuthStore((s) => s.auth)
  const queryClient = useQueryClient()

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
      queryClient.invalidateQueries({ queryKey: appointmentKey.all }).then()
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
    <SafeAreaView className='flex-1 bg-card'>
      <HeaderContainer withTopInset={false}>
        <HStack space='md' className='items-center'>
          <BackButton />
          <Text className='font-semibold text-xl text-foreground'>Prendre rendez-vous</Text>
        </HStack>
      </HeaderContainer>

      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps='handled'
          className='flex-1 bg-background'
          contentContainerClassName='p-4'
        >
          <VStack space='md'>
            {/* Company info */}
            <VStack space='sm' className='mb-5'>
              <Text className='text-lg font-medium text-foreground'>Chez</Text>
              <CompanyInfo companyId={company_id} />
            </VStack>
            {/* Date */}
            <Controller
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormControl isInvalid={!!errors.date} isRequired size='md'>
                  <FormControlLabel>
                    <FormControlLabelText>Date du rendez-vous</FormControlLabelText>
                  </FormControlLabel>
                  <DatePickerInput
                    date={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date.toISOString().split('T')[0])}
                  />
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText className='text-destructive'>{errors.date?.message}</FormControlErrorText>
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
                    <FormControlLabelText>Heure du rendez-vous</FormControlLabelText>
                  </FormControlLabel>
                  <DatePickerInput
                    placeholder='A quelle heure ?'
                    date={field.value ? new Date(`2000-01-01T${field.value}`) : undefined}
                    onChange={(date) => field.onChange(formatDate(date, 'time'))}
                    type='time'
                  />
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText className='text-destructive'>{errors.time?.message}</FormControlErrorText>
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
                  <Input size='lg' className='rounded-lg bg-card'>
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
                    <FormControlErrorText className='text-destructive'>{errors.subject?.message}</FormControlErrorText>
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
                  <Textarea size='lg' className={cnBase('rounded-lg p-1 bg-card h-[200px]')}>
                    <TextareaInput
                      ref={field.ref}
                      placeholder='Décrivez votre besoin, les services et autre...'
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                  </Textarea>
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText className='text-destructive'>{errors.content?.message}</FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            <View className='h-20 w-full' />
          </VStack>
        </ScrollView>
        <View className='px-4 py-2 bg-card border-t border-border' style={{ paddingBottom: 12 }}>
          <Button
            action='primary'
            variant='solid'
            size='lg'
            onPress={onSubmit}
            isDisabled={isPending}
            className='rounded-full mt-2 bg-primary'
          >
            {isPending && <ButtonSpinner className='text-primary-foreground' />}
            <ButtonText className='text-primary-foreground'>Envoyer</ButtonText>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

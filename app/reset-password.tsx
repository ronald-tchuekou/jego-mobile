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
import { defaultResetPasswordValue, resetPasswordSchema, ResetPasswordSchema } from '@/src/features/auth/schemas/reset-pass-schema'
import { IMAGES } from '@/src/lib/images'
import AuthService, { ResetPasswordBody } from '@/src/services/auth-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
			Alert.alert(error.message)
		},
	})

	const onSubmit = form.handleSubmit((data) => mutate({
		confirmPassword: data.passwordConfirmation,
		password: data.password,
		token: '',
		userId: ''
	}))

	const handleState = () => {
		setShowPassword((showState) => {
			return !showState
		})
	}

	return (
		<SafeAreaView edges={['top']} className='flex-1'>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
				<Stack.Screen
					options={{
						headerLeft: BackButton,
					}}
				/>
				<ScrollView
					keyboardShouldPersistTaps='handled'
					contentContainerClassName='flex-1 items-center justify-center p-6'
				>
					<VStack space='md' className='w-full max-w-[420px]'>
						<Image source={IMAGES.splash} className='w-40 h-20 mx-auto mb-5' />
						<Text className='text-3xl font-bold mb-4 text-center'>Créer un nouveau mot de passe</Text>

						<Text className='text-lg text-center'>
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
									<Input size='md' className='rounded-lg' isInvalid={!!errors.password}>
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
											<InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
										</InputSlot>
									</Input>
									<FormControlError>
										<FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-red-500' />
										<FormControlErrorText className='text-red-500'>
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
									<Input size='md' className='rounded-lg' isInvalid={!!errors.password}>
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
											<InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
										</InputSlot>
									</Input>
									<FormControlError>
										<FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-red-500' />
										<FormControlErrorText className='text-red-500'>
											{errors.passwordConfirmation?.message}
										</FormControlErrorText>
									</FormControlError>
								</FormControl>
							)}
						/>

						<Button
							action='primary'
							variant='solid'
							size='md'
							onPress={onSubmit}
							isDisabled={isPending}
							className='rounded-lg mt-2'
						>
							{isPending && <ButtonSpinner className='text-white' />}
							<ButtonText>Valider</ButtonText>
						</Button>

						<View className='h-6' />
					</VStack>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

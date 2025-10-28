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
import { defaultRegisterValue, registerSchema, RegisterSchema } from '@/src/features/auth/schemas/register-schema'
import { IMAGES } from '@/src/lib/images'
import AuthService from '@/src/services/auth-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function RegisterScreen() {
	const login = useAuthStore((s) => s.login)
	const router = useRouter()

	const [showPassword, setShowPassword] = React.useState(false)

	const form = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: defaultRegisterValue,
	})
	const {
		formState: { errors },
	} = form

	const { mutate, isPending } = useMutation({
		mutationFn: async (body: RegisterSchema) => {
			return AuthService.register(body)
		},
		onSuccess: (data) => {
			login(data)
			router.replace('/(tabs)')
		},
		onError: (error) => {
			Alert.alert(error.message)
		},
	})

	const onSubmit = form.handleSubmit((data) => mutate(data))

	const handleState = () => {
		setShowPassword((showState) => {
			return !showState
		})
	}

	return (
		<SafeAreaView edges={['top']} className='flex-1'>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
				<ScrollView
					keyboardShouldPersistTaps='handled'
					contentContainerClassName='flex-1 items-center justify-center p-6'
				>
					<VStack space='md' className='w-full max-w-[420px]'>
						<Image source={IMAGES.splash} className='w-40 h-20 mx-auto mb-5' alt='Logo' />
						<Text className='text-3xl font-bold mb-4 text-center'>Créer un compte</Text>

						<Controller
							control={form.control}
							name='firstName'
							render={({ field }) => (
								<FormControl isInvalid={!!errors.firstName} size='md' isRequired>
									<FormControlLabel>
										<FormControlLabelText>Prénom</FormControlLabelText>
									</FormControlLabel>
									<Input size='md' className='rounded-lg'>
										<InputField
											ref={field.ref}
											placeholder='Prénom'
											value={field.value}
											onChangeText={field.onChange}
											autoCapitalize='words'
											autoCorrect={false}
											returnKeyType='next'
											onSubmitEditing={() => form.setFocus('lastName')}
											autoFocus={true}
										/>
									</Input>
									<FormControlError>
										<FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-red-500' />
										<FormControlErrorText className='text-red-500'>
											{errors.firstName?.message}
										</FormControlErrorText>
									</FormControlError>
								</FormControl>
							)}
						/>

						<Controller
							control={form.control}
							name='lastName'
							render={({ field }) => (
								<FormControl isInvalid={!!errors.lastName} size='md' isRequired>
									<FormControlLabel>
										<FormControlLabelText>Nom</FormControlLabelText>
									</FormControlLabel>
									<Input size='md' className='rounded-lg'>
										<InputField
											ref={field.ref}
											placeholder='Nom'
											value={field.value}
											onChangeText={field.onChange}
											autoCapitalize='words'
											autoCorrect={false}
											returnKeyType='next'
											onSubmitEditing={() => form.setFocus('email')}
										/>
									</Input>
									<FormControlError>
										<FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-red-500' />
										<FormControlErrorText className='text-red-500'>
											{errors.lastName?.message}
										</FormControlErrorText>
									</FormControlError>
								</FormControl>
							)}
						/>

						<Controller
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormControl isInvalid={!!errors.email} size='md' isRequired>
									<FormControlLabel>
										<FormControlLabelText>Adresse email</FormControlLabelText>
									</FormControlLabel>
									<Input size='md' className='rounded-lg'>
										<InputField
											ref={field.ref}
											inputMode='email'
											keyboardType='email-address'
											autoCapitalize='none'
											autoCorrect={false}
											placeholder='Adresse email'
											value={field.value}
											onChangeText={field.onChange}
											returnKeyType='next'
											onSubmitEditing={() => form.setFocus('password')}
										/>
									</Input>
									<FormControlError>
										<FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-red-500' />
										<FormControlErrorText className='text-red-500'>
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
										<FormControlLabelText>Mot de passe</FormControlLabelText>
									</FormControlLabel>
									<Input size='md' className='rounded-lg' isInvalid={!!errors.password}>
										<InputField
											ref={field.ref}
											type={showPassword ? 'text' : 'password'}
											autoCapitalize='none'
											autoCorrect={false}
											placeholder='Mot de passe'
											value={field.value}
											onChangeText={field.onChange}
											returnKeyType='next'
											onSubmitEditing={() => form.setFocus('confirmPassword')}
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
							name='confirmPassword'
							render={({ field }) => (
								<FormControl isInvalid={!!errors.confirmPassword} size='md' isRequired>
									<FormControlLabel>
										<FormControlLabelText>Confirmer le mot de passe</FormControlLabelText>
									</FormControlLabel>
									<Input size='md' className='rounded-lg' isInvalid={!!errors.confirmPassword}>
										<InputField
											ref={field.ref}
											type={showPassword ? 'text' : 'password'}
											autoCapitalize='none'
											autoCorrect={false}
											placeholder='Confirmer le mot de passe'
											value={field.value}
											onChangeText={field.onChange}
											returnKeyType='done'
											onSubmitEditing={onSubmit}
										/>
										<InputSlot className='pr-3' onPress={handleState}>
											<InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
										</InputSlot>
									</Input>
									<FormControlError>
										<FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-red-500' />
										<FormControlErrorText className='text-red-500'>
											{errors.confirmPassword?.message}
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
							<ButtonText>M&apos;inscrire</ButtonText>
						</Button>

						<HStack space='sm'>
							<Text className='text-base'>Vous avez déjà un compte ? </Text>
							<Link href='/login' className='underline text-base text-primary-500' replace>
								Me connecter
							</Link>
						</HStack>

						<View className='h-6' />
					</VStack>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button'
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control'
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from '@/components/ui/icon'
import { Image } from '@/components/ui/image'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { VStack } from '@/components/ui/vstack'
import { defaultLoginFormValue, LoginSchema, loginSchema } from '@/features/auth/login/schema'
import { IMAGES } from '@/lib/images'
import AuthService from '@/services/auth-service'
import { useAuthStore } from '@/stores/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'

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
			console.error(error)
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
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
			<ScrollView
				keyboardShouldPersistTaps='handled'
				contentContainerClassName='flex-1 items-center justify-center p-6'
			>
				<VStack space='md' className='w-full max-w-[420px]'>
					<Image source={IMAGES.splash} className='w-40 h-20 mx-auto mb-5' />
					<Text className='text-3xl font-bold mb-4 text-center'>Se connecter</Text>

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
									<FormControlErrorIcon as={AlertCircleIcon} size='xs' className='text-red-500' />
									<FormControlErrorText className='text-red-500'>{errors.email?.message}</FormControlErrorText>
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

					<Button
						action='primary'
						variant='solid'
						size='md'
						onPress={onSubmit}
						isDisabled={isPending}
						className='rounded-lg mt-2'
					>
						{isPending && <ButtonSpinner className='text-white' />}
						<ButtonText>Se connecter</ButtonText>
					</Button>

					<View className='h-10' />
				</VStack>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

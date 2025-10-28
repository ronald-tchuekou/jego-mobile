import { Button, ButtonText } from '@/components/ui/button'
import { VStack } from '@/components/ui/vstack'
import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native'

export default function RegisterScreen() {
  const login = useAuthStore((s) => s.login)
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async () => {
    if (!email || !password) return
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      router.replace('/')
    } catch (e: any) {
      Alert.alert('Connexion échouée', e?.message ?? 'Vérifiez vos identifiants')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View className='flex-1 items-center justify-center p-6'>
        <VStack space='md' className='w-full max-w-[420px]'>
          <Text className='text-3xl font-bold mb-4'>Se connecter</Text>
          <TextInput
            placeholder='Adresse email'
            inputMode='email'
            autoCapitalize='none'
            autoCorrect={false}
            className='border border-neutral-300 dark:border-neutral-700 rounded-md px-4 h-12'
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder='Mot de passe'
            secureTextEntry
            className='border border-neutral-300 dark:border-neutral-700 rounded-md px-4 h-12'
            value={password}
            onChangeText={setPassword}
          />
          <Button action='primary' variant='solid' size='md' onPress={onSubmit} isDisabled={submitting}>
            <ButtonText>{submitting ? 'Connexion…' : 'Se connecter'}</ButtonText>
          </Button>
        </VStack>
      </View>
    </KeyboardAvoidingView>
  )
}

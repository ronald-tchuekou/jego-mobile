import { useAuthStore } from '@/stores/auth-store'
import { Slot, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function AppLayout() {
  const auth = useAuthStore((s) => s.auth)
  const hydrated = useAuthStore((s) => s.hydrated)
  const router = useRouter()

  useEffect(() => {
    if (hydrated && !auth?.token) {
      router.replace('/login')
    }
  }, [auth, hydrated, router])

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return <Slot />
}



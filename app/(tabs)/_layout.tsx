import { Icon } from '@/src/components/ui/icon'
import { Spinner } from '@/src/components/ui/spinner'
import { useAuthStore } from '@/src/stores/auth-store'
import { Tabs, useRouter } from 'expo-router'
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  CircleUserRoundIcon,
  ListTodoIcon,
  MessageCircleMoreIcon,
} from 'lucide-react-native'
import { useEffect } from 'react'
import { View } from 'react-native'
import { globalStyles } from '@/src/lib/global-styles'
import useTheme from '@/src/hooks/use-theme'

export default function AppLayout() {
  const auth = useAuthStore((s) => s.auth)
  const hydrated = useAuthStore((s) => s.hydrated)
  const router = useRouter()
  const theme = useTheme()

  useEffect(() => {
    if (hydrated && !auth?.token) {
      router.replace('/login')
    }
  }, [auth, hydrated, router])

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size='large' />
      </View>
    )
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: globalStyles.colors.primary[theme],
        headerShown: false,
        tabBarStyle: {
          backgroundColor: globalStyles.colors.card[theme],
          borderTopColor: globalStyles.colors.border[theme],
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Annonces',
          tabBarIcon: ({ color }) => <Icon as={ListTodoIcon} size='lg' color={color} />,
        }}
      />
      <Tabs.Screen
        name='companies'
        options={{
          title: 'Entreprises',
          tabBarIcon: ({ color }) => <Icon as={Building2Icon} size='lg' color={color} />,
        }}
      />
      <Tabs.Screen
        name='jobs'
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color }) => <Icon as={BriefcaseBusinessIcon} size='lg' color={color} />,
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <Icon as={MessageCircleMoreIcon} size='lg' color={color} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Icon as={CircleUserRoundIcon} size='lg' color={color} />,
        }}
      />
    </Tabs>
  )
}

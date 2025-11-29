import { type Auth } from '@/src/services/auth-service'
import UserService from '@/src/services/user-service'
import * as SecureStore from 'expo-secure-store'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const AUTH_KEY = '__jego_auth_key__'

type AuthState = {
  auth: Auth | null
  hydrated: boolean
  login: (auth: Auth) => void
  logout: VoidFunction
  revalidate: VoidFunction
  _setHydrated: (v: boolean) => void
}

const secureStorage = {
  getItem: async (name: string) => {
    return await SecureStore.getItemAsync(name)
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value)
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name)
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      auth: null,
      hydrated: false,
      _setHydrated: (v) => set({ hydrated: v }),

      login: (auth: Auth) => {
        set({ auth })
      },

      logout: () => {
        set({ auth: null })
      },

      revalidate: async () => {
        const current = get().auth
        if (!current?.token) return
        try {
          const user = await UserService.revalidateMe(current.token)
          set({ auth: { ...current, user } })
        } catch {}
      },
    }),
    {
      name: AUTH_KEY,
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ auth: state.auth }),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated(true)
      },
    },
  ),
)

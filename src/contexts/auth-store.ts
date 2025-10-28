import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const isWeb = Platform.OS === 'web'

export interface IUser {
  id: string
  email: string
  name: string
  image: string | null | undefined
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

type AuthState = {
  isLoggedIn: boolean
  hasCompletedOnboarding: boolean
  _hasHydrated: boolean

  user: IUser | null
  token: string | null

  login: (user: IUser, token: string) => void
  logout: () => void
  completeOnboarding: () => void
  setHasHydrated: (value: boolean) => void
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isLoggedIn: false,
      hasCompletedOnboarding: false,
      _hasHydrated: false,
      user: null,
      token: null,

      login: (user: IUser, token: string) =>
        set({
          user,
          token,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isLoggedIn: false,
        }),

      completeOnboarding: () =>
        set({
          hasCompletedOnboarding: true,
        }),

      setHasHydrated: (value: boolean) =>
        set({
          _hasHydrated: value,
        }),
    }),
    {
      name: 'auth-store',
      storage: isWeb
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => ({
            setItem: (key: string, value: string) =>
              SecureStore.setItemAsync(key, value),
            getItem: (key: string) => SecureStore.getItemAsync(key),
            removeItem: (key: string) => SecureStore.deleteItemAsync(key),
          })),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

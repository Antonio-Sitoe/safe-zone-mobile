import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const isWeb = Platform.OS === 'web'

export interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  token: string
  expiresAt: string
}

type AuthState = {
  // Core auth state
  isLoggedIn: boolean
  hasCompletedOnboarding: boolean
  _hasHydrated: boolean

  // User data
  user: User | null
  session: Session | null

  // Actions
  login: (user: User, session: Session) => void
  logout: () => void
  completeOnboarding: () => void
  setHasHydrated: (value: boolean) => void
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      // Initial state
      isLoggedIn: false,
      hasCompletedOnboarding: false,
      _hasHydrated: false,
      user: null,
      session: null,

      // Actions
      login: (user: User, session: Session) =>
        set({
          user,
          session,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          user: null,
          session: null,
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

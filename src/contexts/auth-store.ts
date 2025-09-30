import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

export interface AuthState {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthActions {
  setUser: (user: User) => void
  setSession: (session: Session) => void
  login: (user: User, session: Session) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  checkAuthStatus: () => Promise<void>
}

export type AuthStore = AuthState & AuthActions

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User) => set({ user }),

      setSession: (session: Session) => set({ session }),

      login: (user: User, session: Session) =>
        set({
          user,
          session,
          isAuthenticated: true,
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          error: null,
        }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),

      checkAuthStatus: async () => {
        const { session } = get()

        if (!session) {
          set({ isAuthenticated: false, user: null })
          return
        }

        const now = new Date()
        const expiresAt = new Date(session.expiresAt)

        if (now >= expiresAt) {
          // Session expired, logout
          get().logout()
          return
        }

        // Session is valid
        set({ isAuthenticated: true })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

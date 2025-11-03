import './globals.css'

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'

import * as SplashScreen from 'expo-splash-screen'
import { Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter'
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/contexts/auth-store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
  anchor: 'app',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const { isLoggedIn, hasCompletedOnboarding, _hasHydrated } = useAuthStore()
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  )

  const [loaded] = useFonts({
    Inter: Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
    Montserrat: Montserrat_400Regular,
    'Montserrat-Medium': Montserrat_500Medium,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
  })

  useEffect(() => {
    // Use the onboarding status from the auth store instead of AsyncStorage
    setHasSeenOnboarding(hasCompletedOnboarding)
  }, [hasCompletedOnboarding])

  // Splash
  useEffect(() => {
    if (loaded && hasSeenOnboarding !== null && _hasHydrated) {
      SplashScreen.hideAsync()
    }
  }, [loaded, hasSeenOnboarding, _hasHydrated])

  if (!loaded || hasSeenOnboarding === null || !_hasHydrated) {
    return null
  }

  return (
    <GluestackUIProvider mode="dark">
      <StatusBar style="dark" />
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Protected guard={!hasSeenOnboarding}>
                <Stack.Screen
                  name="onBoarding"
                  options={{ headerShown: false }}
                />
              </Stack.Protected>
              <Stack.Protected guard={hasSeenOnboarding}>
                <Stack.Protected guard={!isLoggedIn}>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="auth" options={{ headerShown: false }} />
                </Stack.Protected>

                <Stack.Protected guard={isLoggedIn}>
                  <Stack.Screen name="app" options={{ headerShown: false }} />
                </Stack.Protected>
              </Stack.Protected>
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GluestackUIProvider>
  )
}

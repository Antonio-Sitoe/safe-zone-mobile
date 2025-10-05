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
import { useEffect } from 'react'
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
import { useAuth } from '@/contexts/auth-store'
// import { initFirebase } from '@/lib/firebase'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
  anchor: 'onboard',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const { checkAuthStatus, isAuthenticated } = useAuth()
  const [loaded] = useFonts({
    Inter: Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
    Montserrat: Montserrat_400Regular,
    'Montserrat-Medium': Montserrat_500Medium,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
  })

  // initFirebase()

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  useEffect(() => {
    checkAuthStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!loaded) {
    return null
  }

  return (
    <GluestackUIProvider mode="dark">
      <StatusBar backgroundColor="#fff" />
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack.Protected>
              <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              </Stack.Protected>
              <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GluestackUIProvider>
  )
}

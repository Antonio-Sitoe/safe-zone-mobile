import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AppLayout() {
  return (
    <SafeAreaView className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopColor: '#e5e7eb',
            borderTopWidth: 1,
            paddingTop: 8,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#1e40af',
          tabBarInactiveTintColor: '#64748b',
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="home/index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="map/index"
          options={{
            title: 'Mapa',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="safeZone/index"
          options={{
            title: 'Zona Segura',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="shield-checkmark-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dangerousZone/index"
          options={{
            title: 'Zona Perigosa',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="warning-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="community/index"
          options={{
            title: 'Comunidade',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  )
}

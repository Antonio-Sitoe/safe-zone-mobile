import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarLabelPosition: "below-icon",
					tabBarStyle: {
						backgroundColor: "#ffffff",
						borderTopColor: "#e5e7eb",
						borderTopWidth: 1,
						paddingTop: 8,
						paddingBottom: 8,
					},
					tabBarActiveTintColor: "#1e40af",
					tabBarInactiveTintColor: "#64748b",
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
					name="home"
					options={{
						title: "Início",
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="home-outline" size={size} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="maps"
					options={{
						title: "Mapa",
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="map-outline" size={size} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: "Perfil",
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="person-outline" size={size} color={color} />
						),
					}}
				/>

				<Tabs.Screen
					name="settings"
					options={{
						title: "Configurações",
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="people-outline" size={size} color={color} />
						),
					}}
				/>
			</Tabs>
		</SafeAreaView>
	);
}

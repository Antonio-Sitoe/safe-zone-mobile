import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AppLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#1e40af",
				headerShown: false,
				tabBarStyle: {
					backgroundColor: "#ffffff",
					borderTopColor: "#e5e7eb",
					paddingBottom: 10,
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Mapa",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="community"
				options={{
					title: "Comunidade",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="people-outline" size={size} color={color} />
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
	);
}

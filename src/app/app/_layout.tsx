import { Tabs } from "expo-router";

import { MapIcon, Users, User, Settings } from "lucide-react-native";
import { SmsButton } from "@/components/sms-button";
import { StyleSheet } from "react-native";

export default function AppLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: styles.tabBar,
				tabBarActiveTintColor: "#1e40af",
				tabBarInactiveTintColor: "#64748B",
				tabBarShowLabel: true,
				tabBarLabelStyle: styles.tabBarLabel,
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Mapa",
					tabBarIcon: ({ color, size, focused }) => (
						<MapIcon color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
					),
				}}
			/>
			<Tabs.Screen
				name="community"
				options={{
					title: "Comunidade",
					tabBarIcon: ({ color, size, focused }) => (
						<Users color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
					),
				}}
			/>

			<Tabs.Screen
				name="sos"
				options={{
					title: "",
					tabBarButton: () => <SmsButton />,
				}}
				listeners={{
					tabPress: (e) => {
						e.preventDefault();
					},
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Configurações",
					tabBarIcon: ({ color, size, focused }) => (
						<Settings color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Perfil",
					tabBarIcon: ({ color, size, focused }) => (
						<User color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
					),
				}}
			/>
		</Tabs>
	);
}

const styles = StyleSheet.create({
	tabBar: {
		backgroundColor: "#FFFFFF",
		borderTopColor: "#FFFFFF",
		height: 115,
	},
	tabBarLabel: {
		fontSize: 11,
		fontWeight: "500",
		marginTop: 4,
	},
});

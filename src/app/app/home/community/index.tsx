import { useState } from "react";
import { View, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { SecondaryHeader } from "@/components/secondary-header";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GroupsTab } from "@/components/comunity-components/GroupsTab";
import { ContactsTab } from "@/components/comunity-components/ContactsTab";

const initialLayout = { width: Dimensions.get("window").width };

const renderTabBar = (props: any) => (
	<TabBar
		{...props}
		indicatorStyle={{ backgroundColor: "#2B4170", height: 3 }}
		style={{
			backgroundColor: "#FFFFFF",
			borderBottomWidth: 1,
			borderBottomColor: "#E5E7EB",
		}}
		labelStyle={{
			fontSize: 14,
			fontWeight: "600",
			textTransform: "none",
			color: "#2B4170",
			fontFamily: "Inter",
		}}
		activeColor="#2B4170"
		inactiveColor="#9CA3AF"
	/>
);

export default function SupportCommunityScreen() {
	const router = useRouter();
	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{ key: "grupos", title: "Grupos" },
		{ key: "contactos", title: "Contactos" },
	]);

	const renderScene = SceneMap({
		grupos: () => <GroupsTab />,
		contactos: () => <ContactsTab />,
	});

	return (
		<SafeAreaView className="flex-1 bg-white">
			<SecondaryHeader title="Grupos e Contatos" onBackPress={() => router.back()} />

			<View className="flex-1">
				<TabView
					navigationState={{ index, routes }}
					renderScene={renderScene}
					onIndexChange={setIndex}
					initialLayout={initialLayout}
					renderTabBar={renderTabBar}
				/>
			</View>
		</SafeAreaView>
	);
}

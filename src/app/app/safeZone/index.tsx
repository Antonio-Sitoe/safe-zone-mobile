import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocationItem } from "@/components/locationItem";
import { FloatingActionButton } from "@/components/floating-action-button";
import { BottomNavigation } from "@/components/menu";
import { SecondaryHeader } from "@/components/secondary-header";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CreateArea } from "@/components/modal/area-form";
import type { SafeLocation } from "@/@types/SafetyZone";

export default function SafeZone() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const [modalVisible, setModalVisible] = useState(params.modalIsOpen === "true" || false);
	const [safeLocations, setSafeLocations] = useState<SafeLocation[]>([
		{ name: "Bairro Malhampsene", safetyLevel: 70 },
		{ name: "Bairro Liberdade", safetyLevel: 50 },
		{ name: "Bairro C700", safetyLevel: 60 },
		{ name: "Bairro Fomento", safetyLevel: 70 },
	]);

	const handleMenuPress = () => {
		console.log("Menu pressed");
	};

	const handleLocationPress = (locationName: string) => {
		console.log(`Location pressed: ${locationName}`);
	};

	const handleSaveLocation = (data: any) => {
		console.log("Saving location data:", data);
	};

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			<View className="flex-1">
				<SecondaryHeader
					title="Zona Segura"
					onBackPress={() => router.back()}
					onMenuPress={handleMenuPress}
				/>

				<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
					<View className="pt-6 pb-4">
						<Text className="text-gray-900 font-bold text-xl px-4 mb-4">Localização</Text>

						{safeLocations.map((location, index) => (
							<LocationItem
								key={index}
								name={location.name}
								level={location.safetyLevel}
								variant="safe"
								onPress={() => handleLocationPress(location.name)}
							/>
						))}
					</View>
				</ScrollView>

				<FloatingActionButton
					onPress={() =>
						router.navigate({
							pathname: "/app/map",
							params: { variant: "safe" },
						})
					}
				/>

				<CreateArea
					variant="safe"
					location={params}
					visible={modalVisible}
					onClose={() => setModalVisible(false)}
					onSave={handleSaveLocation}
				/>

				<BottomNavigation />
			</View>
		</SafeAreaView>
	);
}

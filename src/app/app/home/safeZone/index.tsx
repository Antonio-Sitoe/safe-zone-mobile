import { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocationItem } from "@/components/locationItem";
import { FloatingActionButton } from "@/components/floating-action-button";
import { SecondaryHeader } from "@/components/secondary-header";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { CreateArea } from "@/components/modal/area-form";
import { useQuery } from "@tanstack/react-query";
import { getZonesByType } from "@/actions/zone";
import { Zone } from "@/@types/Zone";

export default function SafeZone() {
	const router = useRouter();
	const { isFocused } = useNavigation();
	const params = useLocalSearchParams();
	const [modalVisible, setModalVisible] = useState(params.modalIsOpen === "true" || false);

	const {
		data: zonesData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["SAFE-ZONE", isFocused],
		queryFn: () => getZonesByType("SAFE"),
	});

	const safeLocations: Zone[] = zonesData?.data || [];

	const handleMenuPress = () => {
		console.log("Menu pressed");
	};

	const handleLocationPress = (zone: Zone) => {
		console.log(`Location pressed: ${zone}`);
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
						<Text onPress={() => refetch()} className="text-gray-900 font-bold text-xl px-4 mb-4">
							Localização
						</Text>

						{isLoading ? (
							<View className="flex-1 justify-center items-center py-8">
								<ActivityIndicator size="large" color="#3B82F6" />
								<Text className="text-gray-600 mt-2">Carregando zonas...</Text>
							</View>
						) : error ? (
							<View className="flex-1 justify-center items-center py-8">
								<Text className="text-red-600 text-center px-4">
									Erro ao carregar zonas. Tente novamente.
								</Text>
							</View>
						) : safeLocations.length === 0 ? (
							<View className="flex-1 justify-center items-center py-8">
								<Text className="text-gray-600 text-center px-4">Nenhuma zona encontrada.</Text>
							</View>
						) : (
							safeLocations.map((location) => (
								<LocationItem
									key={location.id}
									variant="safe"
									name={location.slug}
									level={70}
									onPress={() => handleLocationPress(location)}
								/>
							))
						)}
					</View>
				</ScrollView>

				<FloatingActionButton
					onPress={() =>
						router.navigate({
							pathname: "/app/maps",
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
			</View>
		</SafeAreaView>
	);
}

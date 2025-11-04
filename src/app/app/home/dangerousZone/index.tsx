import { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocationItem } from "@/components/locationItem";
import { FloatingActionButton } from "@/components/floating-action-button";
import { CreateArea } from "@/components/modal/area-form";
import { SecondaryHeader } from "@/components/secondary-header";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useCreateZoneMutation } from "@/react-query/zone/zoneMutations";
import type { Zone, CreateZoneSchema } from "@/@types/Zone";
import { useQuery } from "@tanstack/react-query";
import { getZonesByType } from "@/actions/zone";

export default function DangerousZone() {
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
		queryKey: ["DANGER-ZONE", isFocused],
		queryFn: () => getZonesByType("DANGER"),
	});

	const createZoneMutation = useCreateZoneMutation();

	const dangerousZones: Zone[] = zonesData?.data || [];

	const handleMenuPress = () => {
		console.log("Menu pressed");
	};

	const handleLocationPress = (zone: Zone) => {
		router.navigate({
			pathname: "/app/maps",
			params: {
				variant: "danger",
				zoneId: zone.id,
				latitude: zone.coordinates.latitude.toString(),
				longitude: zone.coordinates.longitude.toString(),
				description: zone.description,
			},
		});
	};

	const handleSaveLocation = async (data: any) => {
		try {
			const zoneData: CreateZoneSchema = {
				slug: data.location,
				date: data.date,
				hour: data.time,
				description: data.description,
				type: "DANGER",
				coordinates: {
					latitude: parseFloat(params.lat as string) || 0,
					longitude: parseFloat(params.lng as string) || 0,
				},
				featureDetails: {
					insufficientLighting: data.characteristics?.poorLighting || false,
					lackOfPolicing: data.characteristics?.noPolicePresence || false,
					abandonedHouses: data.characteristics?.houses || false,
				},
			};

			await createZoneMutation.mutateAsync(zoneData);
			setModalVisible(false);
			Alert.alert("Sucesso", "Zona perigosa criada com sucesso!");
		} catch (error) {
			console.error("Error creating zone:", error);
			Alert.alert("Erro", "Erro ao criar zona perigosa. Tente novamente.");
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="flex-1">
				<SecondaryHeader
					title="Zona Perigosa"
					onBackPress={() => router.back()}
					onMenuPress={handleMenuPress}
				/>

				<Text
					className="text-gray-900 font-bold font-roboto text-xl px-6 mt-6 mb-2"
					onPress={() => refetch()}
				>
					Localização
				</Text>

				<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
					<View className="pt-6 pb-4">
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
						) : dangerousZones.length === 0 ? (
							<View className="flex-1 justify-center items-center py-8">
								<Text className="text-gray-600 text-center px-4">
									Nenhuma zona perigosa encontrada.
								</Text>
							</View>
						) : (
							dangerousZones.map((zone) => (
								<LocationItem
									key={zone.id}
									variant="danger"
									name={zone.slug}
									level={70}
									onPress={() => handleLocationPress(zone)}
								/>
							))
						)}
					</View>
				</ScrollView>

				<FloatingActionButton
					onPress={() =>
						router.navigate({
							pathname: "/app/maps",
							params: { variant: "danger" },
						})
					}
				/>

				<CreateArea
					visible={modalVisible}
					location={params}
					variant="danger"
					onClose={() => setModalVisible(false)}
					onSave={handleSaveLocation}
				/>
			</View>
		</SafeAreaView>
	);
}

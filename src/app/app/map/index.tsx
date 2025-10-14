import MapComponent from "@/components/map";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetAllZonesQuery } from "@/react-query/zone/zoneQuery";

export default function MapScreen() {
	const params = useLocalSearchParams();
	
	// Fetch all zones to display on map
	const { data: zonesData, isLoading } = useGetAllZonesQuery();
	const allZones = zonesData?.data || [];
	
	return (
		<SafeAreaView className="flex-1">
			<MapComponent 
				variant={params.variant as "safe" | "danger"} 
				zones={allZones}
				isLoading={isLoading}
			/>
		</SafeAreaView>
	);
}

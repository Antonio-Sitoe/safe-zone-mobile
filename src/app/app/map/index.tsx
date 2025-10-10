import MapComponent from "@/components/map";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapScreen() {
	const params = useLocalSearchParams();
	return (
		<SafeAreaView className="flex-1">
			<MapComponent variant={params.variant as "safe" | "danger"} />
		</SafeAreaView>
	);
}

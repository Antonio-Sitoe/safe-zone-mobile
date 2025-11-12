import { View } from "react-native";
import { MapPin, AlertTriangle, Map as MapIcon, Users } from "lucide-react-native";
import { SafetyCard } from "./index";
import { useRouter } from "expo-router";

export function CardsGrid() {
	const router = useRouter();
	return (
		<View className="px-4 py-6">
			<View className="flex-row mb-2">
				<SafetyCard
					title="zona segura"
					icon={MapPin}
					onPress={() => router.push("/app/home/safeZone")}
				/>
				<SafetyCard
					title="zona de perigo"
					icon={AlertTriangle}
					onPress={() => router.push("/app/home/dangerousZone")}
				/>
			</View>

			<View className="flex-row mt-2">
				<SafetyCard title="Mapa" icon={MapIcon} onPress={() => console.log("map")} />
				<SafetyCard
					title="Comunidade de Apoio"
					icon={Users}
					onPress={() => router.push("/app/community")}
				/>
			</View>
		</View>
	);
}

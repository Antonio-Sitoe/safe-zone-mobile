import { View, TouchableOpacity, Text } from "react-native";
import { Home, Search, User, Settings } from "lucide-react-native";
import type { NavItem } from "@/@types/NavItem";

const navItems: NavItem[] = [
	{ icon: Home, label: "Home", active: true },
	{ icon: Search, label: "Buscar" },
	{ icon: User, label: "Perfil" },
	{ icon: Settings, label: "Configurações" },
];

export function BottomNavigation() {
	return (
		<View className="flex-row bg-white border-t border-gray-200 pt-2 pb-2 ">
			{navItems.map((item, index) => {
				const Icon = item.icon;
				return (
					<TouchableOpacity key={index} className="flex-1 items-center py-2" activeOpacity={0.7}>
						<Icon size={24} color={item.active ? "#1e40af" : "#64748b"} strokeWidth={1.5} />
						<Text className={`text-xs mt-1${item.active ? "text-[#1e40af]" : "text-[#64748b]"}`}>
							{item.label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

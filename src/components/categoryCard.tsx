import { View, Text, Pressable } from "react-native";
import { Users } from "lucide-react-native";
import { CategoryCardProps } from "@/@types/Category";

export const CategoryCard = ({ name, count, onPress }: CategoryCardProps) => {
	return (
		<Pressable
			onPress={onPress}
			className="bg-white rounded-2xl p-4 mb-3 shadow-sm active:opacity-70"
		>
			<View className="flex-row items-center">
				<View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-3">
					<Users size={24} color="#2B4170" />
				</View>
				<View className="flex-1">
					<Text className="text-lg font-semibold text-gray-900">{name}</Text>
					<Text className="text-sm text-gray-500">{count} Contato</Text>
				</View>
			</View>
		</Pressable>
	);
};

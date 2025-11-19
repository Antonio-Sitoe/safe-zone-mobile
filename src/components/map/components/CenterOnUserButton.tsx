import { memo } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

type CenterOnUserButtonProps = {
	onPress: () => void;
	isVisible: boolean;
	className?: string;
};

const CenterOnUserButtonComponent = ({
	onPress,
	isVisible,
	className,
}: CenterOnUserButtonProps) => {
	if (!isVisible) {
		return null;
	}

	return (
		<TouchableOpacity
			onPress={onPress}
			className={cn(
				"absolute bottom-64 right-4 rounded-full bg-slate-800/90 p-3.5",
				"border border-slate-600/40 shadow-lg shadow-black/40",
				className
			)}
			activeOpacity={0.85}
		>
			<Ionicons name="locate" size={24} color="#10B981" />
		</TouchableOpacity>
	);
};

export const CenterOnUserButton = memo(CenterOnUserButtonComponent);

import { memo } from "react";
import { Text, TouchableOpacity } from "react-native";
import { cn } from "@/lib/utils";

type StyleToggleButtonProps = {
	isSatellite: boolean;
	onToggle: () => void;
	className?: string;
};

const StyleToggleButtonComponent = ({
	isSatellite,
	onToggle,
	className,
}: StyleToggleButtonProps) => (
	<TouchableOpacity
		activeOpacity={0.85}
		className={cn("rounded-full bg-black/70 px-4 py-2.5", className)}
		onPress={onToggle}
	>
		<Text className="text-sm font-semibold text-white">{isSatellite ? "Mapa" : "Satélite"}</Text>
	</TouchableOpacity>
);

export const StyleToggleButton = memo(StyleToggleButtonComponent);

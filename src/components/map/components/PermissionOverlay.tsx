import { memo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { cn } from "@/lib/utils";

type PermissionOverlayProps = {
	isChecking: boolean;
	hasPermission: boolean | null;
	className?: string;
};

const PermissionOverlayComponent = ({
	isChecking,
	hasPermission,
	className,
}: PermissionOverlayProps) => {
	if (isChecking) {
		return (
			<View
				className={cn(
					"absolute bottom-8 left-6 right-6 items-center gap-2 rounded-xl bg-black/70 px-4 py-4",
					className
				)}
			>
				<ActivityIndicator size="large" color="#5CA439" />
				<Text className="text-sm text-white text-center">A obter localização…</Text>
			</View>
		);
	}

	if (hasPermission === false) {
		return (
			<View
				className={cn(
					"absolute bottom-8 left-6 right-6 items-center gap-2 rounded-xl bg-black/70 px-4 py-4",
					className
				)}
			>
				<Text className="text-lg font-semibold text-white text-center">Permissão negada</Text>
				<Text className="text-sm text-white text-center">
					Autoriza o acesso à localização nas definições do dispositivo para visualizar o mapa
					centrado na tua posição.
				</Text>
			</View>
		);
	}

	return null;
};

export const PermissionOverlay = memo(PermissionOverlayComponent);

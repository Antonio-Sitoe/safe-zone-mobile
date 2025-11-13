import { View, Text, Modal } from "react-native";
import { Check, AlertTriangle } from "lucide-react-native";
import { Button } from "../ui/button";
import type { StatusModalProps, SuccessModalProps } from "@/@types/area";

const statusConfig = {
	success: {
		icon: <Check size={40} color="#FFFFFF" strokeWidth={3} />,
		iconBg: "bg-green-500",
		defaultTitle: "Operação concluída com sucesso",
		defaultMessage: "Tudo foi processado corretamente.",
		buttonClass: "bg-green-600",
	},
	error: {
		icon: <AlertTriangle size={40} color="#FFFFFF" strokeWidth={3} />,
		iconBg: "bg-red-500",
		defaultTitle: "Algo deu errado",
		defaultMessage: "Tente novamente mais tarde.",
		buttonClass: "bg-red-600",
	},
};

export const StatusModal = ({
	visible,
	onClose,
	title,
	message,
	status = "success",
	actionLabel = "Fechar",
}: StatusModalProps) => {
	const config = statusConfig[status];

	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<View className="flex-1 bg-black/50 items-center justify-center px-6">
				<View className="bg-white rounded-3xl p-8 w-full max-w-sm items-center">
					<View
						className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${config.iconBg}`}
					>
						{config.icon}
					</View>

					<Text className="text-xl font-bold text-gray-900 text-center mb-2">
						{title ?? config.defaultTitle}
					</Text>

					<Text className="text-base text-gray-600 text-center mb-6">
						{message ?? config.defaultMessage}
					</Text>

					<View className="w-full">
						<Button size="lg" onPress={onClose} className={config.buttonClass}>
							<Text className="text-white font-semibold">{actionLabel}</Text>
						</Button>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export const SuccessModal = (props: SuccessModalProps) => (
	<StatusModal {...props} status="success" />
);

export const ErrorModal = (props: Omit<StatusModalProps, "status">) => (
	<StatusModal {...props} status="error" />
);

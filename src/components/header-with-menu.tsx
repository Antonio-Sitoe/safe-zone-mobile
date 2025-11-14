import React, { useState } from "react";
import { Text as ButtonText, View, Text, TouchableOpacity, Modal } from "react-native";
import { ChevronLeft, MoreVertical } from "lucide-react-native";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/components/ui/icon";
import type { SafeZoneHeaderProps } from "@/@types/SafetyZone";

interface HeaderWithMenuProps extends SafeZoneHeaderProps {
	onDelete?: () => void;
	deleteTitle?: string;
	deleteMessage?: string;
}

export function HeaderWithMenu({
	onBackPress,
	title,
	onDelete,
	deleteTitle = "Remover",
	deleteMessage = "Tem certeza que deseja remover?",
}: HeaderWithMenuProps) {
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleDeletePress = () => {
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = () => {
		setShowDeleteModal(false);
		onDelete?.();
	};

	const handleCancelDelete = () => {
		setShowDeleteModal(false);
	};

	return (
		<>
			<View className="flex-row items-center justify-between p-4 bg-white shadow-sm">
				<TouchableOpacity
					onPress={onBackPress}
					className="flex-row items-center"
					activeOpacity={0.7}
				>
					<ChevronLeft size={24} color="#1e293b" strokeWidth={2} />
					<Text className="text-secondary-800 font-medium text-base ml-1 font-body">Voltar</Text>
				</TouchableOpacity>

				<Text className="font-montserrat-bold text-lg">{title}</Text>

				{onDelete && (
					<Menu
						placement="bottom"
						className="bg-white"
						offset={5}
						trigger={({ ...triggerProps }) => {
							return (
								<TouchableOpacity {...triggerProps} className="p-2" activeOpacity={0.7}>
									<MoreVertical size={24} color="#1e293b" />
								</TouchableOpacity>
							);
						}}
					>
						<MenuItem
							key="delete"
							textValue="Apagar"
							onPress={handleDeletePress}
							className="text-black font-inter-bold flex-row items-center gap-2"
						>
							<TrashIcon width={16} height={16} className="mr-2" />
							<MenuItemLabel size="sm" className="text-black font-inter-bold">
								Apagar
							</MenuItemLabel>
						</MenuItem>
					</Menu>
				)}
			</View>

			<Modal
				visible={showDeleteModal}
				transparent={true}
				animationType="fade"
				onRequestClose={handleCancelDelete}
			>
				<View className="flex-1 bg-black/50 items-center justify-center px-6">
					<View className="bg-white rounded-3xl p-8 w-full max-w-sm">
						<Text className="text-xl font-bold text-gray-900 text-center mb-2 font-body">
							{deleteTitle}
						</Text>

						<Text className="text-base text-gray-600 text-center mb-6 font-body">
							{deleteMessage}
						</Text>

						<View className="flex-row gap-3">
							<Button
								variant="link"
								size="lg"
								onPress={handleCancelDelete}
								className="flex-1 border-none bg-gray-100 text-black font-inter-bold"
							>
								<ButtonText className="text-gray-500 font-inter-bold">Cancelar</ButtonText>
							</Button>
							<Button size="lg" onPress={handleConfirmDelete} className="flex-1">
								<ButtonText className="text-white font-inter-bold">Apagar</ButtonText>
							</Button>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
}

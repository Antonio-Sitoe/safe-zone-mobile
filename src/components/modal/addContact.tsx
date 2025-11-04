import { useState, useEffect } from "react";
import { View, Text, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { InputSecondary } from "../ui/input/input";
import { Button } from "../ui/button";
import {
	Actionsheet,
	ActionsheetContent,
	ActionsheetItem,
	ActionsheetItemText,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper,
	ActionsheetBackdrop,
	ActionsheetScrollView,
} from "../ui/actionsheet";
import type { AddContactModalProps } from "@/@types/Contact";

export const AddContactModal = ({ visible, onClose, onSubmit, data }: AddContactModalProps) => {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [selectedGroup, setSelectedGroup] = useState<string>("");
	const [showGroupSelector, setShowGroupSelector] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const selectedGroupName =
		data?.data.find((group: any) => group.id === selectedGroup)?.name || "Selecione um grupo";

	useEffect(() => {
		if (!visible) {
			setName("");
			setPhone("");
			setSelectedGroup("");
			setShowGroupSelector(false);
		}
	}, [visible]);

	const handleSubmit = async () => {
		if (!name.trim() || !phone.trim() || !selectedGroup) {
			console.error("Preencha todos os campos e selecione um grupo");
			return;
		}

		setIsSubmitting(true);
		try {
			await onSubmit(name.trim(), phone.trim(), selectedGroup);
			handleClose();
		} catch (error) {
			console.error("Error adding contact:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setName("");
		setPhone("");
		setSelectedGroup("");
		setShowGroupSelector(false);
		onClose();
	};

	return (
		<>
			<Actionsheet isOpen={visible} onClose={handleClose}>
				<ActionsheetBackdrop onPress={handleClose} />
				<ActionsheetContent className="bg-white">
					<ActionsheetDragIndicatorWrapper>
						<ActionsheetDragIndicator />
					</ActionsheetDragIndicatorWrapper>
					<KeyboardAwareScrollView
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
						enableOnAndroid={true}
						enableAutomaticScroll={true}
						extraScrollHeight={20}
						keyboardOpeningTime={0}
						style={{
							width: "100%",
						}}
						contentContainerStyle={{
							paddingTop: 6,
							paddingBottom: 32,
						}}
					>
						<Text className="text-2xl font-bold text-gray-900 text-center mb-6">
							Adicionar Contacto
						</Text>

						<InputSecondary
							label="Nome"
							placeholder="Introduza O Nome"
							value={name}
							onChangeText={setName}
						/>

						<InputSecondary
							label="Número De Celular"
							placeholder="+258"
							value={phone}
							onChangeText={setPhone}
							keyboardType="phone-pad"
						/>

						<Text className="text-base font-medium text-gray-900 mb-2 mt-4">Selecione Grupo</Text>
						<Button
							size="lg"
							variant="outline"
							onPress={() => {
								Keyboard.dismiss();
								setShowGroupSelector(true);
							}}
							className="w-full"
						>
							<Text className="text-gray-900 font-medium">{selectedGroupName}</Text>
						</Button>

						<View className="mt-6 space-y-3 flex-row justify-between gap-3">
							<Button
								size="lg"
								onPress={handleSubmit}
								disabled={!name.trim() || !phone.trim() || !selectedGroup || isSubmitting}
								className="flex-1"
							>
								<Text className="text-white font-semibold">
									{isSubmitting ? "Adicionando..." : "Adicionar"}
								</Text>
							</Button>

							<Button size="lg" variant="gray" onPress={handleClose} className="flex-1">
								<Text className="text-gray-900 font-semibold">Fechar</Text>
							</Button>
						</View>
					</KeyboardAwareScrollView>
				</ActionsheetContent>
			</Actionsheet>

			<Actionsheet isOpen={showGroupSelector} onClose={() => setShowGroupSelector(false)}>
				<ActionsheetBackdrop onPress={() => setShowGroupSelector(false)} />
				<ActionsheetContent className="bg-white">
					<ActionsheetDragIndicatorWrapper>
						<ActionsheetDragIndicator />
					</ActionsheetDragIndicatorWrapper>
					<ActionsheetScrollView>
						{data?.data.map((group: any) => (
							<ActionsheetItem
								key={group.id}
								onPress={() => {
									setSelectedGroup(group.id);
									setShowGroupSelector(false);
								}}
							>
								<ActionsheetItemText className="text-black">{group.name}</ActionsheetItemText>
							</ActionsheetItem>
						))}
					</ActionsheetScrollView>
				</ActionsheetContent>
			</Actionsheet>
		</>
	);
};

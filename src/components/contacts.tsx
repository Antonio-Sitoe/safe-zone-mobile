import { useEffect, useState } from "react";
import {
	Modal,
	View,
	Text,
	FlatList,
	Pressable,
	TextInput,
	ScrollView,
	StatusBar,
} from "react-native";
import * as Contacts from "expo-contacts";
import { X } from "lucide-react-native";

interface ContactPickerModalProps {
	visible: boolean;
	onClose: () => void;
	onSelectContacts: (contactIds: string[]) => void;
	initialSelectedContacts: string[];
	availableContacts: any;
}

export const ContactPickerModal = ({
	visible,
	onClose,
	onSelectContacts,
	initialSelectedContacts = [],
	availableContacts = [],
}: ContactPickerModalProps) => {
	const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
	const [selected, setSelected] = useState<string[]>(initialSelectedContacts);
	const [search, setSearch] = useState("");

	useEffect(() => {
		if (visible) {
			loadContacts();
			setSelected(initialSelectedContacts);
		}
	}, [visible, initialSelectedContacts]);

	const loadContacts = async () => {
		const { status } = await Contacts.requestPermissionsAsync();
		if (status !== "granted") {
			alert("Permissão negada para acessar os contactos!");
			return;
		}

		const { data } = await Contacts.getContactsAsync({
			fields: [Contacts.Fields.PhoneNumbers],
		});
		if (data.length > 0) {
			const sorted = data.sort((a, b) => a.name?.localeCompare(b.name || "") || 0);
			setContacts(sorted);
		}
	};

	const toggleSelect = (contactId: string) => {
		const alreadySelected = selected.includes(contactId);
		if (alreadySelected) {
			setSelected(selected.filter((id) => id !== contactId));
		} else {
			setSelected([...selected, contactId]);
		}
	};

	const handleDone = () => {
		onSelectContacts(selected);
		onClose();
	};

	const handleClose = () => {
		setSelected(initialSelectedContacts);
		onClose();
	};

	const filteredContacts = contacts.filter((c) =>
		c.name?.toLowerCase().includes(search.toLowerCase())
	);

	const getSelectedContactsData = () => {
		return availableContacts?.filter((c: any) => selected.includes(c.id)) || [];
	};

	const removeSelectedContact = (contactId: string) => {
		setSelected(selected.filter((id) => id !== contactId));
	};

	return (
		<Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
			<View className="flex-1 bg-white">
				<View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
					<Text className="text-lg font-semibold text-gray-900">Selecionar Contactos</Text>
					<Pressable onPress={handleClose}>
						<X size={24} color="#374151" />
					</Pressable>
				</View>

				<View className="px-5 py-3">
					<TextInput
						placeholder="Pesquisar contacto..."
						value={search}
						onChangeText={setSearch}
						className="border border-gray-300 rounded-xl px-4 py-2 text-base text-gray-800"
						placeholderTextColor="#9CA3AF"
					/>
				</View>

				<FlatList
					data={filteredContacts}
					keyExtractor={(item: any) => item.id}
					renderItem={({ item }: { item: any }) => {
						const selectedItem = selected.includes(item.id);
						const phone = item.phoneNumbers?.[0]?.number || "Sem número";

						return (
							<Pressable
								onPress={() => toggleSelect(item.id)}
								className={`px-5 py-3 border-b border-gray-100 active:opacity-70 ${
									selectedItem ? "bg-blue-50" : "bg-white"
								}`}
							>
								<Text className="text-base font-medium text-gray-900">{item.name}</Text>
								<Text className="text-sm text-gray-500">{phone}</Text>
							</Pressable>
						);
					}}
				/>

				{selected.length > 0 && (
					<View className="p-4 border-t border-gray-200 bg-gray-50">
						<Text className="text-base font-semibold mb-2 text-gray-800">Selecionados:</Text>
						<ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
							{getSelectedContactsData().map((contact: any) => (
								<View
									key={contact.id}
									className="flex-row items-center bg-blue-100 px-3 py-1.5 rounded-full mr-2 mb-2"
								>
									<Text className="text-blue-800 mr-2">{contact.name || contact.phone}</Text>
									<Pressable onPress={() => removeSelectedContact(contact.id)}>
										<X size={16} color="#1E40AF" />
									</Pressable>
								</View>
							))}
						</ScrollView>

						<Pressable
							onPress={handleDone}
							className="bg-primary rounded-xl mt-3 py-3 items-center active:opacity-80"
						>
							<Text className=" font-semibold text-base">Adicionar Selecionados</Text>
						</Pressable>
					</View>
				)}
			</View>
		</Modal>
	);
};

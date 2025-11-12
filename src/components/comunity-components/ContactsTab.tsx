import { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getContactsByUserId } from "@/actions/community";
import { Phone, User, Users, UserPlus, Trash2 } from "lucide-react-native";
import { useAuthStore } from "@/contexts/auth-store";
import { useGetGroupsDataQuery } from "@/react-query/community/community/groupQuery";
import {
	useCreateContactMutation,
	useDeleteContactMutation,
} from "@/react-query/community/community/contactMutation";
import { AddContactModal } from "@/components/modal/addContact";
import { SuccessModal } from "@/components/modal/notification";
import { useNavigation } from "expo-router";
export const ContactsTab = () => {
	const { user } = useAuthStore();
	const userId = user?.id || "";
	const { isFocused } = useNavigation();
	const [showAddContactModal, setShowAddContactModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [successMessage, setSuccessMessage] = useState({
		title: "",
		message: "",
	});

	const { data: contactsData, isLoading: contactsLoading } = useQuery({
		queryKey: ["all-contacts", userId, isFocused],
		queryFn: () => getContactsByUserId(userId),
	});

	const { data: groups } = useGetGroupsDataQuery(userId);
	const createContactMutation = useCreateContactMutation();
	const deleteContactMutation = useDeleteContactMutation();

	const contactsByGroup = contactsData?.data?.data || [];

	const totalContacts = contactsByGroup.reduce(
		(sum: number, group: any) => sum + (group.contacts?.length || 0),
		0
	);

	const handleAddContact = async (name: string, phone: string, groupId: string) => {
		createContactMutation.mutate(
			{
				groupId,
				name,
				phone,
			},
			{
				onSuccess: () => {
					setSuccessMessage({
						title: "Contato Adicionado Com Sucesso.",
						message: "O Novo Contato Foi Incluído Em Sua Lista Com Êxito",
					});
					setShowSuccessModal(true);
					setShowAddContactModal(false);
				},
				onError: (error: any) => {
					setSuccessMessage({
						title: "Erro",
						message: error?.message || "Erro ao adicionar contato",
					});
					setShowSuccessModal(true);
				},
			}
		);
	};

	const handleDeleteContact = (contactId: string, contactName: string) => {
		Alert.alert("Remover Contato", `Tem certeza que deseja remover ${contactName}?`, [
			{
				text: "Cancelar",
				style: "cancel",
			},
			{
				text: "Remover",
				style: "destructive",
				onPress: () => {
					deleteContactMutation.mutate(
						{ contactId },
						{
							onSuccess: () => {
								setSuccessMessage({
									title: "Contato Removido Com Sucesso.",
									message: "O Contato Foi Removido Da Sua Lista Com Éxito",
								});
								setShowSuccessModal(true);
							},
							onError: (error: any) => {
								setSuccessMessage({
									title: "Erro",
									message: error?.message || "Erro ao remover contato",
								});
								setShowSuccessModal(true);
							},
						}
					);
				},
			},
		]);
	};

	if (contactsLoading) {
		return (
			<View className="flex-1 items-center justify-center py-10">
				<ActivityIndicator size="large" color="#2B4170" />
			</View>
		);
	}

	return (
		<View className="flex-1">
			{totalContacts === 0 ? (
				<View className="flex-1 items-center justify-center py-20">
					<User size={48} color="#9CA3AF" />
					<Text className="text-gray-500 text-base mt-4 text-center font-body">
						Nenhum contato cadastrado
					</Text>
				</View>
			) : (
				<ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
					<View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
						<View className="flex-row items-center">
							<View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4">
								<Users size={24} color="#2B4170" />
							</View>
							<View className="flex-1">
								<Text className="text-lg font-bold text-gray-900 font-body">Total de Contatos</Text>
								<Text className="text-sm text-gray-600 font-body">
									{totalContacts} {totalContacts === 1 ? "Contato" : "Contatos"}
								</Text>
							</View>
						</View>
					</View>

					<View className="space-y-6 pb-6 gap-4">
						{contactsByGroup.map((group: any) => (
							<View key={group.groupId || group.groupName} className="mb-4">
								<View className="bg-gray-100 rounded-xl px-4 py-2 mb-3">
									<Text className="text-base font-semibold text-gray-700 font-body">
										{group.groupName}
									</Text>
									<Text className="text-sm text-gray-500 font-body">
										{group.contacts?.length || 0}{" "}
										{group.contacts?.length === 1 ? "Contato" : "Contatos"}
									</Text>
								</View>
								<View className="space-y-3 gap-4">
									{group.contacts?.map((contact: any) => (
										<View
											key={contact.id}
											className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center"
										>
											<View className="flex-row items-center flex-1">
												<View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
													<User size={24} color="#2B4170" />
												</View>
												<View className="flex-1">
													<Text className="text-lg font-semibold text-gray-900 mb-1 font-body">
														{contact.name}
													</Text>
													<View className="flex-row items-center">
														<Phone size={14} color="#6B7280" />
														<Text className="text-sm text-gray-600 ml-2 font-body">
															{contact.phone}
														</Text>
													</View>
												</View>
											</View>
											<TouchableOpacity
												onPress={() => handleDeleteContact(contact.id, contact.name)}
												className="ml-3 p-2 bg-red-50 rounded-lg active:opacity-70"
											>
												<Trash2 size={18} color="#EF4444" />
											</TouchableOpacity>
										</View>
									))}
								</View>
							</View>
						))}
					</View>
				</ScrollView>
			)}

			<TouchableOpacity
				onPress={() => setShowAddContactModal(true)}
				className="absolute bottom-6 right-6 w-20 h-20 bg-app-primary rounded-full items-center justify-center shadow-lg"
				style={{
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 5,
				}}
			>
				<UserPlus size={24} color="#FFFFFF" />
			</TouchableOpacity>

			<AddContactModal
				visible={showAddContactModal}
				onClose={() => setShowAddContactModal(false)}
				data={groups}
				onSubmit={handleAddContact}
			/>

			<SuccessModal
				visible={showSuccessModal}
				onClose={() => setShowSuccessModal(false)}
				title={successMessage.title}
				message={successMessage.message}
			/>
		</View>
	);
};

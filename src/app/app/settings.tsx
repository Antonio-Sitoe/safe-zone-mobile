import React, { useState } from "react";
import { View, Text, Switch, ScrollView } from "react-native";
import { Send, Video } from "lucide-react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
	const [smartphoneSend, setSmartphoneSend] = useState(true);
	const [smartphoneRecord, setSmartphoneRecord] = useState(false);
	const [wearableSend, setWearableSend] = useState(false);
	const [wearableRecord, setWearableRecord] = useState(true);

	return (
		<SafeAreaView className="flex-1 bg-white">
			<ScrollView className="flex-1 bg-white">
				<View className="flex-row items-center justify-center py-4 border-b border-gray-200 relative">
					<Text className="text-lg font-semibold font-roboto text-black">Configurações</Text>
				</View>

				<Section title="Disparado pelo Smartphone">
					<SettingCard
						icon={<Send size={20} color="white" />}
						text="Enviar para contactos de segurança"
						value={smartphoneSend}
						onValueChange={setSmartphoneSend}
					/>
					<SettingCard
						icon={<Video size={20} color="white" />}
						text="Gravar no mapa wearable"
						value={smartphoneRecord}
						onValueChange={setSmartphoneRecord}
					/>
				</Section>

				<Section title="Disparado pelo Wearable">
					<SettingCard
						icon={<Send size={20} color="white" />}
						text="Enviar para contactos de segurança"
						value={wearableSend}
						onValueChange={setWearableSend}
					/>
					<SettingCard
						icon={<Video size={20} color="white" />}
						text="Gravar no wearable"
						value={wearableRecord}
						onValueChange={setWearableRecord}
					/>
				</Section>
			</ScrollView>
		</SafeAreaView>
	);
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
	<View className="mt-6 px-6">
		<Text className="text-base font-semibold text-black mb-3">{title}</Text>
		<View className="gap-6">{children}</View>
	</View>
);

const SettingCard = ({
	icon,
	text,
	value,
	onValueChange,
}: {
	icon: React.ReactNode;
	text: string;
	value: boolean;
	onValueChange: (val: boolean) => void;
}) => (
	<View className="flex-row items-center justify-between w-full bg-[#1D2C5E] rounded-2xl px-4 py-3">
		<View className="flex-row items-center flex-1 gap-3 mr-3" style={{ minWidth: 0 }}>
			<View style={{ flexShrink: 0 }}>{icon}</View>
			<Text className="text-white text-sm font-roboto" style={{ flex: 1, flexShrink: 1 }}>
				{text}
			</Text>
		</View>
		<View style={{ flexShrink: 0 }}>
			<Switch
				value={value}
				onValueChange={onValueChange}
				trackColor={{ true: "#4ADE80", false: "#E5E7EB" }}
			/>
		</View>
	</View>
);

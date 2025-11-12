import { memo } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import type { Coordinates, ZoneType } from "../store";
import { parseReports } from "../utils";

type ZoneModalProps = {
	visible: boolean;
	pendingCoordinate: Coordinates | null;
	zoneDescription: string;
	zoneReports: string;
	zoneType: ZoneType;
	editingZoneSlug: string | null;
	onChangeDescription: (value: string) => void;
	onChangeReports: (value: string) => void;
	onSelectType: (type: ZoneType) => void;
	onRequestClose: () => void;
	onSave: () => void;
};

const ZoneModalComponent = ({
	visible,
	pendingCoordinate,
	zoneDescription,
	zoneReports,
	zoneType,
	editingZoneSlug,
	onChangeDescription,
	onChangeReports,
	onSelectType,
	onRequestClose,
	onSave,
}: ZoneModalProps) => {
	const reportsValue = parseReports(zoneReports);
	const isCritical = reportsValue >= 10;
	const disabledTypes: ZoneType[] = isCritical ? ["SAFE", "DANGER"] : [];

	return (
		<Modal visible={visible} animationType="slide" transparent onRequestClose={onRequestClose}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<View style={styles.content}>
					<Text style={styles.title}>{editingZoneSlug ? "Editar zona" : "Nova zona"}</Text>
					<Text style={styles.subtitle}>
						Localização:{" "}
						{pendingCoordinate
							? `${pendingCoordinate[1].toFixed(5)}, ${pendingCoordinate[0].toFixed(5)}`
							: "Seleciona no mapa"}
					</Text>

					<TextInput
						value={zoneDescription}
						onChangeText={onChangeDescription}
						placeholder="Descrição da zona"
						placeholderTextColor="#9E9E9E"
						style={[styles.input, styles.multiline]}
						multiline
					/>

					<TextInput
						value={zoneReports}
						onChangeText={onChangeReports}
						placeholder="Número de relatos"
						placeholderTextColor="#9E9E9E"
						keyboardType="number-pad"
						style={styles.input}
					/>

					<Text style={styles.sectionTitle}>Tipo de zona</Text>
					<View style={styles.typeSelector}>
						{(["SAFE", "DANGER"] satisfies ZoneType[]).map((type) => {
							const isSelected = zoneType === type;
							const label = type === "SAFE" ? "Zona Segura" : "Zona de Perigo";
							const isDisabled = disabledTypes.includes(type);

							return (
								<TouchableOpacity
									key={type}
									style={[
										styles.typeChip,
										isSelected && styles.typeChipSelected,
										isDisabled && styles.typeChipDisabledState,
									]}
									onPress={() => onSelectType(type)}
									disabled={isDisabled}
									activeOpacity={0.85}
								>
									<Text style={[styles.typeChipText, isSelected && styles.typeChipTextSelected]}>
										{label}
									</Text>
								</TouchableOpacity>
							);
						})}
						<View style={styles.typeChipDisabled}>
							<Text style={styles.typeChipDisabledText}>Área Crítica</Text>
						</View>
					</View>
					<Text style={styles.hint}>
						Áreas com 10 ou mais relatos tornam-se críticas independentemente do tipo selecionado.
					</Text>

					<View style={styles.actions}>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={onRequestClose}
							activeOpacity={0.85}
						>
							<Text style={styles.cancelText}>Cancelar</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.saveButton} onPress={onSave} activeOpacity={0.85}>
							<Text style={styles.saveText}>{editingZoneSlug ? "Guardar" : "Criar"}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.65)",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	content: {
		width: "100%",
		backgroundColor: "#1F1F1F",
		borderRadius: 20,
		padding: 20,
		gap: 12,
	},
	title: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "700",
	},
	subtitle: {
		color: "#BDBDBD",
		fontSize: 12,
	},
	input: {
		backgroundColor: "#2C2C2C",
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 12,
		color: "#fff",
		fontSize: 14,
	},
	multiline: {
		minHeight: 80,
		textAlignVertical: "top",
	},
	sectionTitle: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "600",
		marginTop: 4,
	},
	typeSelector: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	typeChip: {
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 20,
		backgroundColor: "rgba(189, 189, 189, 0.15)",
	},
	typeChipSelected: {
		backgroundColor: "rgba(92, 164, 57, 0.25)",
		borderWidth: 1,
		borderColor: "#5CA439",
	},
	typeChipDisabledState: {
		opacity: 0.45,
	},
	typeChipText: {
		color: "#F2F2F2",
		fontSize: 12,
		fontWeight: "600",
	},
	typeChipTextSelected: {
		color: "#5CA439",
	},
	typeChipDisabled: {
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 20,
		backgroundColor: "rgba(235, 87, 87, 0.15)",
		borderWidth: 1,
		borderColor: "#EB5757",
	},
	typeChipDisabledText: {
		color: "#EB5757",
		fontSize: 12,
		fontWeight: "600",
	},
	hint: {
		color: "#E0E0E0",
		fontSize: 12,
	},
	actions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 12,
		marginTop: 4,
	},
	cancelButton: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 10,
		backgroundColor: "rgba(189, 189, 189, 0.2)",
	},
	saveButton: {
		paddingHorizontal: 18,
		paddingVertical: 10,
		borderRadius: 10,
		backgroundColor: "#5CA439",
	},
	cancelText: {
		color: "#E0E0E0",
		fontSize: 14,
		fontWeight: "600",
	},
	saveText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "700",
	},
});

export const ZoneModal = memo(ZoneModalComponent);

import { CharacteristicKey } from "./schemas/create-zone";

export const formatDateToISO = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export const formatDateForDisplay = (isoDate: string): string => {
	try {
		const [year, month, day] = isoDate.split("-");
		return `${day}/${month}/${year}`;
	} catch {
		return isoDate;
	}
};

export const SAFE_CHARACTERISTICS = [
	{ key: "goodLighting", label: "Boa Iluminação" },
	{ key: "policePresence", label: "Presença policial" },
	{ key: "publicTransport", label: "Transporte público acessível" },
] satisfies readonly { key: CharacteristicKey; label: string }[];

export const DANGER_CHARACTERISTICS = [
	{ key: "poorLighting", label: "Iluminação Insuficiente" },
	{ key: "noPolicePresence", label: "Falta de Policiamento" },
	{ key: "houses", label: "Casas Abandonadas" },
] satisfies readonly { key: CharacteristicKey; label: string }[];

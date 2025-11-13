export interface CreateModalProps {
	visible: boolean;
	onClose: () => void;
	onSave: (data: SafeZoneData) => void;
	variant: "safe" | "danger";
	location: any;
}

export interface SafeZoneData {
	slug: string;
	location: string;
	date: string;
	time: string;
	description: string;
	characteristics: {
		goodLighting: boolean;
		policePresence: boolean;
		publicTransport: boolean;
	};
	media: { uri: string; name: string; type: string }[];
}

export interface StatusModalProps {
	visible: boolean;
	onClose: () => void;
	title?: string;
	message?: string;
	status?: "success" | "error";
	actionLabel?: string;
}

export type SuccessModalProps = Omit<StatusModalProps, "status">;

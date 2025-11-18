export interface AddContactModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (name: string, phone: string, groupId: string) => Promise<void>;
	data: any;
}
export interface Contact {
	id?: string;
	name: string;
	phone: string;
	isManual?: boolean;
}

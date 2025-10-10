export interface CreateGroupModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (name: string, memberIds: string[]) => Promise<void>;
	availableContacts: any;
}

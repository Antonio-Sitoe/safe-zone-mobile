import type { Contact } from "./Contact";

export interface CreateGroupModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (name: string, members: Contact[]) => void;
	availableContacts: any;
	groupId?: string;
	initialData?: {
		name: string;
		members: Contact[];
	};
	mode?: 'create' | 'edit';
}

export interface CreateGroupSchema {
	name: string;
	contacts: Contact[];
}

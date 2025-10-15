import type { Contact } from "./Contact";

export interface CreateGroupModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (name: string, members: Contact[]) => void;
	availableContacts: any;
}

export interface CreateGroupSchema {
	name: string;
	contacts: Contact[];
}

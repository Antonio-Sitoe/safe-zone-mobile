import type { CreateGroupSchema } from "@/@types/Group";
import { api } from "@/lib/axios";

export const getGroups = async (userId: string) => {
	try {
		const response = await api.get(`/groups/${userId}`);
		return { data: response.data || [], error: false };
	} catch (error: any) {
		console.error({ error });

		return { error: true, message: error.request.message };
	}
};
export const getGroupsByUser = async (userId: string) => {
	try {
		console.log("lll");
		const response = await api.get(`/groups/user/${userId}`);
		return { data: response.data || [], error: false };
	} catch (error: any) {
		console.error({ error });

		return { error: true, message: error.request.message };
	}
};
export const getGroupById = async (id: string) => {
	try {
		const response = await api.get(`/groups/group/${id}`);

		return { data: response.data, error: false };
	} catch (error: any) {
		console.error({ error });

		return { error: true, message: error.request.message };
	}
};

export const getGroupWithContacts = async (id: string) => {
	try {
		const response = await api.get(`/groups/group/${id}/contacts`);

		return { data: response.data, error: false };
	} catch (error: any) {
		console.error({ error });

		return { error: true, message: error.request.message };
	}
};

export const getContactsByGroupId = async (groupId: string) => {
	try {
		const response = await api.get(`/groups/contacts/${groupId}`);

		return { data: response.data, error: false };
	} catch (error: any) {
		console.error({ error });

		return { error: true, message: error.request.message };
	}
};

export const getContactsByUserId = async (userId: string) => {
	try {
		const response = await api.get(`/groups/contacts/user/${userId}`);

		return { data: response.data, error: false };
	} catch (error: any) {
		console.error({ error });

		return { error: true, message: error.request.message };
	}
};

export const createGroup = async (userId: string, data: CreateGroupSchema) => {
	try {
		console.log(data, userId);
		const response = await api.post(`/groups/${userId}`, data);

		return { data: response, error: false };
	} catch (error: any) {
		console.log(error.request);

		return { error: true, message: error.request.message };
	}
};

export const updateGroup = async (data: CreateGroupSchema, id: string) => {
	try {
		const response = await api.put(`/groups/group/${id}/contacts`, data);

		return { data: response, error: false };
	} catch (error: any) {
		console.error({ error });

		return { error: true, message: error.request.message };
	}
};
export const deleteGroup = async (id: string) => {
	try {
		const response = await api.delete(`/groups/${id}`);

		return { data: response, error: false };
	} catch (error: any) {
		console.error({ error });

		return { error: true, message: error.request.message };
	}
};

export const deleteContact = async (contactId: string) => {
	try {
		const response = await api.delete(`/groups/contact/${contactId}`);

		return { data: response, error: false };
	} catch (error: any) {
		console.error({ error });

		return { error: true, message: error.request.message };
	}
};

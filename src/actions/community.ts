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
		const response = await api.get(`/groups/${id}`);

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
		const response = api.put(`/groups/${id}`, { data });

		return { data: response, error: false };
	} catch (error: any) {
		console.error({ error });

		return { error: true, message: error.request.message };
	}
};
export const deleteGroup = async (id: string) => {
	try {
		const response = api.delete(`/groups/${id}`);

		return { data: response, error: false };
	} catch (error: any) {
		console.error({ error });

		return { error: true, message: error.request.message };
	}
};

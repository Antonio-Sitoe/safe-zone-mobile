import { api } from "@/lib/axios";
import { SignInFormData } from "@/utils/schemas/sign-in-schema";
import type { SignUpSubmitData } from "@/utils/schemas/sign-up-schema";

export async function signUp(data: SignUpSubmitData) {
	const response = await api.post("/auth/sign-up/email", data);
	return response.data;
}

export interface UpdateUserData {
	name?: string;
	image?: string;
}

export interface ChangePasswordData {
	currentPassword: string;
	newPassword: string;
	revokeOtherSessions?: boolean;
}

export async function signIn(data: SignInFormData) {
	try {
		const response = await api.post("/auth/sign-in/email", data);
		return { data: response.data?.data, error: null };
	} catch (error) {
		return { data: null, error: error };
	}
}

export async function updateUser(data: UpdateUserData) {
	const response = await api.put("/auth/user", data);
	return response.data;
}

export async function changePassword(data: ChangePasswordData) {
	const response = await api.post("/auth/change-password", data);
	return response.data;
}

export async function deactivateAccount() {
	const response = await api.post("/auth/deactivate-account");
	return response.data;
}

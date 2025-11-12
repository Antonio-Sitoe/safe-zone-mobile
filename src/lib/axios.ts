import axios from "axios";
import { env } from "./env";
import { useAuthStore } from "@/contexts/auth-store";

console.log({ env: env.EXPO_PUBLIC_API_URL });

const api = axios.create({
	baseURL: env.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
	const { token } = useAuthStore.getState();

	console.log({ token });
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export { api };

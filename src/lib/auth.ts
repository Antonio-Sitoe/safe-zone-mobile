import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { env } from "./env";

export const authClient = createAuthClient({
	baseURL: env.EXPO_PUBLIC_API_URL,
	plugins: [
		emailOTPClient(),
		expoClient({
			scheme: "safezone",
			storagePrefix: "safezone",
			storage: SecureStore,
		}),
	],
});

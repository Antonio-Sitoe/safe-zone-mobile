import { z } from "zod";

export const envSchema = z.object({
	EXPO_PUBLIC_API_URL: z
		.string()
		.default("https://g44ooscs4ggkg4s84w0kcsow.colify.antoniositoehl.sbs"),
});

export const env = envSchema.parse(process.env);

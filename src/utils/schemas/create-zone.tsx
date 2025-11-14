import { z } from "zod";

export const createZoneSchema = z.object({
	location: z.string().min(3, "Localização deve ter pelo menos 3 caracteres"),
	date: z.string(),
	time: z.string(),
	description: z.string().min(5, "Descrição deve ter pelo menos 5 caracteres"),
	characteristics: z.object({
		goodLighting: z.boolean().optional(),
		policePresence: z.boolean().optional(),
		publicTransport: z.boolean().optional(),
		poorLighting: z.boolean().optional(),
		noPolicePresence: z.boolean().optional(),
		houses: z.boolean().optional(),
	}),
});
export type ZoneFormData = z.infer<typeof createZoneSchema>;
export type CharacteristicKey = keyof ZoneFormData["characteristics"];

import { z } from "zod";

export const sendEmailSchema = z.object({
	email: z.email({ error: "Digite um email válido" }).min(1, "Email é obrigatório"),
});

export type SendEmailFormData = z.infer<typeof sendEmailSchema>;

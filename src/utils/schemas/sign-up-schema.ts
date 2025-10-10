import { z } from "zod";

export const signUpSchema = z
	.object({
		name: z
			.string()
			.min(2, "Nome deve ter pelo menos 2 caracteres")
			.max(50, "Nome deve ter no máximo 50 caracteres")
			.regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
		email: z.email("Email inválido").min(1, "Email é obrigatório"),
		phone: z
			.string()
			.max(9, "Telefone deve ter no máximo 9 dígitos")
			.min(9, "Telefone deve ter pelo menos 9 dígitos")
			.regex(/^\+?[1-9]\d{1,14}$/, "Formato de telefone inválido"),
		password: z
			.string()
			.min(8, "Senha deve ter pelo menos 8 caracteres")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número"
			),
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Senhas não coincidem",
		path: ["confirmPassword"],
	});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export type SignUpSubmitData = Pick<
	z.infer<typeof signUpSchema>,
	"email" | "phone" | "password" | "name"
>;

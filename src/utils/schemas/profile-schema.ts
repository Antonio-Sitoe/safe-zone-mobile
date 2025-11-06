import { z } from 'zod'

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(100, 'Nome muito longo'),
    image: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.image && data.image.trim() !== '') {
        try {
          new URL(data.image)
          return true
        } catch {
          return false
        }
      }
      return true
    },
    {
      message: 'URL da imagem inválida',
      path: ['image'],
    }
  )

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: z
      .string()
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .max(128, 'Senha muito longa'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>


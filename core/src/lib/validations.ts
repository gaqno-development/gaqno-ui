import { z } from 'zod'

export const passwordSchema = z.string()
  .min(6, 'A senha deve ter no mínimo 6 caracteres')

export const strongPasswordSchema = z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número')

export const confirmPasswordRefinement = (data: { password?: unknown; confirmPassword?: unknown }) => {
  return data.password === data.confirmPassword
}

export const createPasswordWithConfirmSchema = <T extends z.ZodObject<any>>(
  baseSchema: T,
  passwordField: z.ZodString = strongPasswordSchema
) => {
  return baseSchema.extend({
    password: passwordField,
    confirmPassword: z.string(),
  }).refine(confirmPasswordRefinement, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
}


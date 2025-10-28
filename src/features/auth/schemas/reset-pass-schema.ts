import { z } from 'zod'

export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(1, 'Le mot de passe est requis')
			.min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
		passwordConfirmation: z.string().min(1, 'Veuillez confirmer votre mot de passe'),
		token: z.string().min(1, 'Le jeton de réinitialisation est requis'),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: 'Les mots de passe ne correspondent pas',
		path: ['passwordConfirmation'],
	})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

export const defaultResetPasswordValue: ResetPasswordSchema = {
	password: '',
	passwordConfirmation: '',
	token: '',
}

import z from 'zod'

export const ForgotPasswordSchema = z.object({
    email: z.email().min(1, 'Email is reqired'),
})
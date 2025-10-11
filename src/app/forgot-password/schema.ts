import z from 'zod'

export const ForgotPasswordSchema = z.object({
    username: z.string().min(1, 'Username is reqired'),
})
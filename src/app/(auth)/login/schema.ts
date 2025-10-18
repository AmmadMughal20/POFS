import z from 'zod'

export const LoginSchema = z.object({
    email: z.email().min(1, 'Email is reqired'),
    password: z.string().min(1, 'Password is reqired')
})
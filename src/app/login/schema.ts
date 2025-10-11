import z from 'zod'

export const LoginSchema = z.object({
    username: z.string().min(1, 'Username is reqired'),
    password: z.string().min(1, 'Password is reqired')
})
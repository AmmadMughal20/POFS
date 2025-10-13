import z from 'zod'

export const LoginSchema = z.object({
    fruits: z.array(z.string()).nonempty('Select at least one fruit'),
    role: z.enum(['admin', 'member'], 'Role is required'),
    desc: z.string().min(1, 'Desc is reqired'),
    username: z.string().min(1, 'Username is reqired'),
    password: z.string().min(1, 'Password is reqired')
})
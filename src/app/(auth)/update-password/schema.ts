import z from "zod";

export const UpdatePasswordSchema = z.object({
    email: z.email('Invalid email').min(1, 'Email is required'),
    new_password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirm_password: z.string().min(8, 'Confirm Password is required'),
}).superRefine((data, ctx) =>
{
    if (data.new_password !== data.confirm_password)
    {
        ctx.addIssue({
            path: ['confirm_password'],
            message: 'Passwords do not match',
            code: 'custom',
        });
    }
});
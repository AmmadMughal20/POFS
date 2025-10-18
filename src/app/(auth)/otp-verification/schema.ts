import z from 'zod'

export const OTPSchema = z.object({
    email: z.email().min(1, 'Email is reqired'),
    otp: z.string().min(1, 'OTP is reqired')
})
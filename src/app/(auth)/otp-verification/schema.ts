import z from 'zod'

export const OTPSchema = z.object({
    username: z.string().min(1, 'Username is reqired'),
    otp: z.string().min(1, 'OTP is reqired')
})
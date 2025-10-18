'use server'
import { verifyOTP } from "@/server/auth";
import { OTPSchema } from "./schema"
import { cookies } from "next/headers";

export interface OTPState
{
    errors?: Record<string, string[]>;
    success?: boolean;
}

export async function handleOtpAction(prevState: OTPState, formData: FormData)
{
    const email = (await cookies()).get('otp_email')?.value
    const otp = formData.get('otp')
    const data = {
        email,
        otp
    }

    if (!email || !otp || typeof email !== 'string' || typeof otp != 'string')
    {
        return { errors: { email: ['Invalid email or OTP value.'] } };
    }

    const result = OTPSchema.safeParse(data)

    if (!result.success)
    {
        return { errors: result.error.flatten().fieldErrors }
    }

    if (!email) return { errors: { email: ['Email is missing'] } }

    const verificationResult = await verifyOTP(email, otp);

    if (verificationResult)
    {
        return { success: true }
    } else
    {
        return { errors: { otp: ['Invalid OTP'] } }
    }

}

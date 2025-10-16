'use server'
import { OTPSchema } from "./schema"

export interface OTPState
{
    errors?: Record<string, string[]>;
    success?: boolean;
}

export async function handleOtpAction(prevState: OTPState, formData: FormData)
{
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const data = {
        username: formData.get('username'),
        otp: formData.get('otp')
    }

    const result = OTPSchema.safeParse(data)

    if (!result.success)
    {
        return { errors: result.error.flatten().fieldErrors }
    }
    return { success: true }

}

'use server'
import { generateOTP } from "@/server/auth";
import { ForgotPasswordSchema } from "./schema";
import { sendVerificationEmail } from "@/helpers/sendVerificationemail";
import { cookies } from "next/headers";

export interface ForgotPasswordState
{
    errors?: Record<string, string[]>;
    success?: boolean;
}

export async function handleForgotPasswordAction(prevState: ForgotPasswordState, formData: FormData)
{

    const email = formData.get('email')

    if (typeof email !== 'string')
    {
        return { errors: { email: ['Invalid email value.'] } };
    }

    const result = ForgotPasswordSchema.safeParse({ email })

    if (!result.success)
    {
        return { errors: result.error.flatten().fieldErrors }
    }

    const otpResult = await generateOTP(email);

    (await cookies()).set('otp_email', email, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 5, // expires in 5 minutes
        path: '/',      // accessible to the OTP route
    })

    let otpCode;
    if ('otpGenerated' in otpResult)
    {
        const { otpGenerated, value } = otpResult;
        if (otpGenerated)
        {
            otpCode = value
            // Additional logic can go here if needed
        }
    } else
    {
        return { otpResult };
    }
    if (otpCode)
    {
        await sendVerificationEmail(email, otpCode);
        return { success: true }
    } else
    {
        return { errors: { email: ['OTP Sending failure'] } }
    }


}

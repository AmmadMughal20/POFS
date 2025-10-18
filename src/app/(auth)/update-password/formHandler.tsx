'use server'
import { updatePassword } from "@/server/auth";
import { cookies } from "next/headers";
import { UpdatePasswordSchema } from "./schema";

export interface OTPState
{
    errors?: Record<string, string[]>;
    success?: boolean;
}

export async function handleUpdatePasswordAction(prevState: OTPState, formData: FormData)
{
    const email = (await cookies()).get('otp_email')?.value
    const new_password = formData.get('new-password')
    const confirm_password = formData.get('confirm-password')

    const data = {
        email,
        new_password,
        confirm_password
    }

    if (!email || typeof email !== 'string')
    {
        return { errors: { email: ['Invalid email'] } };
    }

    if (typeof new_password !== 'string')
    {
        return { errors: { new_password: ['Invalid new password.'] } };
    }

    if (typeof confirm_password !== 'string')
    {
        return { errors: { confirm_password: ['Invalid confirm password.'] } };
    }

    const result = UpdatePasswordSchema.safeParse(data)

    if (!result.success)
    {
        return { errors: result.error.flatten().fieldErrors }
    }

    const updatePasswordResult = await updatePassword(email, new_password)

    if (updatePasswordResult)
    {
        (await cookies()).delete("otp_email")
        return { success: true }
    } else
    {
        return { errors: { new_password: ['Update failed!'] } }
    }

}

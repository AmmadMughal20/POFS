'use server'
import { ForgotPasswordSchema } from "./schema"

export interface ForgotPasswordState
{
    errors?: Record<string, string[]>;
    success?: boolean;
}

export async function handleForgotPasswordAction(prevState: ForgotPasswordState, formData: FormData)
{
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const data = {
        username: formData.get('username')
    }

    const result = ForgotPasswordSchema.safeParse(data)

    if (!result.success)
    {
        return { errors: result.error.flatten().fieldErrors }
    }
    return { success: true }

}

'use server'
import { ForgotPasswordSchema } from "./schema"

export async function handleForgotPasswordAction(prevState: any, formData: FormData)
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

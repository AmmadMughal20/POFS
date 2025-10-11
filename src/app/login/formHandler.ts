'use server'
import { LoginSchema } from "./schema"

export async function handleLoginAction(prevState: any, formData: FormData)
{
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const data = {
        username: formData.get('username'),
        password: formData.get('password'),
    }

    const result = LoginSchema.safeParse(data)
    console.log(result)

    if (!result.success)
    {
        return { errors: result.error.flatten().fieldErrors }
    }
    return { success: true }

}

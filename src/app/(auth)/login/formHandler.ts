'use server'
import { LoginSchema } from "./schema"


export interface LoginState
{
    errors?: Record<string, string[]>;
    success?: boolean;
}

export async function handleLoginAction(prevState: LoginState, formData: FormData)
{
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const data = {
        fruits: formData.getAll('fruits'),
        role: formData.get('role'),
        desc: formData.get('desc'),
        username: formData.get('username'),
        password: formData.get('password'),
    }

    console.log(data)

    const result = LoginSchema.safeParse(data)

    if (!result.success)
    {
        return { errors: result.error.flatten().fieldErrors }
    }
    return { success: true }

}

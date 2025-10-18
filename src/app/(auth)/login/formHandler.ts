'use client'
import { signIn } from "next-auth/react";
import { LoginSchema } from "./schema"


export interface LoginState
{
    errors?: Record<string, string[]>;
    success?: boolean;
}

export async function handleLoginAction(prevState: LoginState, formData: FormData)
{
    const email = formData.get('email')
    const password = formData.get('password')


    const result = LoginSchema.safeParse({ email, password })

    if (!result.success)
    {
        return { errors: result.error.flatten().fieldErrors }
    }

    const signInResult = await signIn('credentials', {
        email: email, // your authOptions expects `email`
        password
    })

    console.log(signInResult, 'printing signin result')
    return { success: true }

}

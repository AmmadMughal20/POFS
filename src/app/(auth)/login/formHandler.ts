import { signIn } from "next-auth/react";
import { LoginSchema } from "./schema"

export interface LoginState
{
    errors?: Record<string, string[]>;
    success?: boolean;
}

export async function handleLoginAction(
    prevState: LoginState,
    formData: FormData
): Promise<LoginState>
{
    const email = formData.get('email');
    const password = formData.get('password');

    // Validate using Zod
    const result = LoginSchema.safeParse({ email, password });
    if (!result.success)
    {
        return { errors: result.error.flatten().fieldErrors };
    }

    const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
    });

    if (signInResult?.error)
    {
        return {
            errors: {
                password: ['Invalid email or password!'],
            },
        };
    }

    // Success ✅
    return { success: true };
}

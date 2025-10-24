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

    try
    {
        const signInResult = await signIn("credentials", {
            email,
            password,
            redirect: false, // prevent auto-redirect
        });

        // ✅ Check authentication result
        if (signInResult?.error)
        {
            const errorMsg =
                signInResult.error === "CredentialsSignin"
                    ? "Invalid email or password!"
                    : signInResult.error; // handles custom thrown messages

            return {
                errors: { password: [errorMsg] },
            };
        }

        // ✅ If sign-in succeeded
        if (signInResult?.ok)
        {
            return { success: true };
        }

        return {
            errors: { general: ["Unexpected error occurred"] },
        };
    } catch (error)
    {
        // ✅ Type-safe error handling
        const message =
            error instanceof Error ? error.message : "Something went wrong during sign-in";
        return { errors: { general: [message] } };
    }
}

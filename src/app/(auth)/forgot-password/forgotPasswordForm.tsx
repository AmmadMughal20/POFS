'use client'
import Button from '@/components/ui/Button/Button'
import Form from '@/components/ui/Form/Form'
import Input from '@/components/ui/Input/Input'
import Label from '@/components/ui/Label/Label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useTransition } from 'react'
import SubmitButton from '../login/SubmitButton'
import { handleForgotPasswordAction } from './formHandler'

const ForgotPasswordForm = () =>
{
    const initialState = {
        errors: {
        }
    }

    const router = useRouter()
    const [state, formAction] = useActionState(handleForgotPasswordAction, initialState)
    const [isPending, startTransition] = useTransition()

    useEffect(() =>
    {
        if (state.success)
        {
            // redirect after success
            const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]')
            if (emailInput)
            {
                router.push(`/otp-verification`)
            }
        }
    }, [state.success, router])

    return (
        <Form title='Forgot Password' onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault(); // prevent page reload

            const formData = new FormData(e.currentTarget);
            startTransition(() =>
            {
                formAction(formData); // call your useActionState handler
            })
        }}>
            <div className='flex flex-col'>
                <Label htmlFor='email'>Email</Label>
                <Input name='email' type="email" placeholder='Enter Email' autoFocus />
                {
                    state.errors?.email && (
                        <p className="text-error">{state.errors.email[0]}</p>
                    )
                }
            </div>
            {
                state.success ?
                    <div className='text-success'>
                        Form Submitted Successfully</div> : <p className='text-red-500'>{state.otpResult?.errors?.email[0]}</p>
            }
            <div className='flex justify-evenly items-center w-full mt-5'>
                <SubmitButton />
                <Link href='/login'>
                    <Button type='reset' variant='secondary' disabled={isPending}>
                        Cancel
                    </Button>
                </Link>
            </div>
        </Form>
    )
}

export default ForgotPasswordForm
'use client'
import Button from '@/components/ui/Button/Button'
import Form from '@/components/ui/Form/Form'
import Input from '@/components/ui/Input/Input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { startTransition, useActionState, useEffect } from 'react'
import SubmitButton from '../login/SubmitButton'
import { handleOtpAction } from './formHandler'

const OtpVerificationForm = ({ email }: { email: string | null }) =>
{
    const initialState = {
        errors: {
        }
    }

    const [state, formAction] = useActionState(handleOtpAction, initialState)
    const router = useRouter()

    useEffect(() =>
    {
        if (state.success)
        {
            // redirect after success
            const otpInput = document.querySelector<HTMLInputElement>('input[name="otp"]')
            if (otpInput)
            {
                router.push(`/update-password`)
            }
        }
    }, [state.success, router])

    return (
        <Form title='Verify OTP' onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault(); // prevent page reload
            if (email)
            {
                const formData = new FormData(e.currentTarget);
                formData.append("email", email)
                startTransition(() =>
                {
                    formAction(formData); // call your useActionState handler
                })

            }
        }}>
            <p className="text-gray-700">An OTP is sent to email if it exists.</p>
            <div className='flex flex-col'>
                <Input name='otp' placeholder='Enter OTP sent to your number' autoFocus />
                {
                    state.errors?.otp && (
                        <p className="text-error">{state.errors.otp[0] || state.errors.email}</p>
                    )
                }
            </div>
            {
                state.success ?
                    <div className='text-success'>
                        Form Submitted Successfully</div> : <>{state.errors?.otp}</>
            }
            <div className='flex justify-evenly items-center w-full mt-5'>
                <SubmitButton />
                <Link href='/login'>
                    <Button type='reset' variant='secondary'>
                        Cancel
                    </Button>
                </Link>
            </div>
            <div className='mt-5 text-center'>
                <Link href='/forgot-password'>Resend OTP</Link>
            </div>
        </Form>
    )
}

export default OtpVerificationForm
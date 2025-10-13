'use client'
import Form from '@/components/ui/Form/Form'
import Input from '@/components/ui/Input/Input'
import Label from '@/components/ui/Label/Label'
import PasswordInput from '@/components/ui/PasswordInput/PasswordInput'
import Link from 'next/link'
import { useActionState, useState } from 'react'
import { handleOtpAction } from './formHandler'
import SubmitButton from '../login/SubmitButton'
import Button from '@/components/ui/Button/Button'

const OtpVerificationForm = () =>
{
    const initialState = {
        errors: {
        }
    }

    const [state, formAction] = useActionState(handleOtpAction, initialState)

    const [fieldType, setFieldType] = useState<'password' | 'text'>('password')

    const handleTypeChange = () =>
    {
        fieldType === 'password' ? setFieldType('text') : setFieldType('password')
    }

    return (
        <Form title='Verify OTP' action={formAction}>
            <div className='flex flex-col'>
                <Label htmlFor='otp'>OTP</Label>
                <Input name='otp' placeholder='Enter OTP sent to your number' autoFocus />
                {
                    state.errors?.otp && (
                        <p className="text-error">{state.errors.otp[0]}</p>
                    )
                }
            </div>
            {
                state.success &&
                <div className='text-success'>
                    Form Submitted Successfully</div>
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
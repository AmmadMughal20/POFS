'use client'
import Button from '@/components/Button/Button'
import Form from '@/components/Form/Form'
import Input from '@/components/Input/Input'
import Label from '@/components/Label/Label'
import Link from 'next/link'
import { useActionState } from 'react'
import SubmitButton from '../login/SubmitButton'
import { handleForgotPasswordAction } from './formHandler'

const ForgotPasswordForm = () =>
{
    const initialState = {
        errors: {
        }
    }

    const [state, formAction] = useActionState(handleForgotPasswordAction, initialState)

    return (
        <Form title='Forgot Password' action={formAction}>
            <div className='flex flex-col'>
                <Label htmlFor='username'>Username</Label>
                <Input name='username' placeholder='Enter Username' autoFocus />
                {
                    state.errors?.username && (
                        <p className="text-error">{state.errors.username[0]}</p>
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
        </Form>
    )
}

export default ForgotPasswordForm
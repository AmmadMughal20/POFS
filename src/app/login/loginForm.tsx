'use client'
import Form from '@/components/Form/Form'
import Input from '@/components/Input/Input'
import Label from '@/components/Label/Label'
import Link from 'next/link'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { handleLoginAction } from './formHandler'
import SubmitButton from './SubmitButton'

const LoginForm = () =>
{
    const initialState = {
        errors: {
        }
    }

    const [state, formAction] = useActionState(handleLoginAction, initialState)
    const { pending } = useFormStatus();

    return (
        <Form title='Login' action={formAction}>
            <div className='flex flex-col'>
                <Label htmlFor='username'>Username</Label>
                <Input name='username' placeholder='Enter Username' autoFocus />
                {
                    state.errors?.username && (
                        <p className="text-error">{state.errors.username[0]}</p>
                    )
                }
            </div>
            <div className='flex flex-col'>
                <Label htmlFor='password'>Password</Label>
                <Input name='password' placeholder='Enter Password' type='password' />
                {
                    state.errors?.password && (
                        <p className="text-error">{state.errors.password[0]}</p>
                    )
                }
            </div>
            {
                state.success &&
                <div className='text-success'>
                    Form Submitted Successfully</div>
            }
            <SubmitButton title='Sign In' />
            <div className='mt-5 text-center'>
                <Link href='/forgot-password'>Forgot password?</Link>
            </div>
        </Form>
    )
}

export default LoginForm
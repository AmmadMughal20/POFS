'use client'
import Form from '@/components/ui/Form/Form'
import FormGroup from '@/components/ui/FormGroup/FormGroup'
import Input from '@/components/ui/Input/Input'
import Label from '@/components/ui/Label/Label'
import PasswordInput from '@/components/ui/PasswordInput/PasswordInput'
import Link from 'next/link'
import { startTransition, useActionState } from 'react'
import { handleLoginAction } from './formHandler'
import SubmitButton from './SubmitButton'

const LoginForm = () =>
{
    const initialState = {
        errors: {}
    }

    const [state, formAction] = useActionState(handleLoginAction, initialState)

    return (
        <Form title='Login' onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault(); // prevent page reload

            const formData = new FormData(e.currentTarget);
            startTransition(() =>
            {
                formAction(formData); // call your useActionState handler
            })
        }} className='!min-w-75'>
            <FormGroup>
                <Label htmlFor='email'>Email</Label>
                <Input name='email' type='email' placeholder='Enter Email' />
                {
                    state.errors?.email && (
                        <p className="text-error">{state.errors.email[0]}</p>
                    )
                }
            </FormGroup>
            <div className='flex flex-col'>
                <Label htmlFor='password'>Password</Label>
                <PasswordInput name='password' placeholder='Enter Password' />
                {
                    state.errors?.password && (
                        <p className="text-error">{state.errors.password[0]}</p>
                    )
                }
            </div>
            {
                state.success ?
                    <div className='text-success'>
                        Form Submitted Successfully
                    </div> : <></>
            }
            <SubmitButton title='Sign In' />
            <div className='mt-5 text-center'>
                <Link href='/forgot-password'>Forgot password?</Link>
            </div>
        </Form>
    )
}

export default LoginForm
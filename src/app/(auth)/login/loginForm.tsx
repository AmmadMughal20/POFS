'use client'
import Form from '@/components/ui/Form/Form'
import Input from '@/components/ui/Input/Input'
import Label from '@/components/ui/Label/Label'
import PasswordInput from '@/components/ui/PasswordInput/PasswordInput'
import Link from 'next/link'
import { useActionState, useState } from 'react'
import { handleLoginAction } from './formHandler'
import SubmitButton from './SubmitButton'
import FormGroup from '@/components/ui/FormGroup/FormGroup'

const LoginForm = () =>
{
    const initialState = {
        errors: {
        }
    }

    const [state, formAction] = useActionState(handleLoginAction, initialState)

    const [fieldType, setFieldType] = useState<'password' | 'text'>('password')

    const handleTypeChange = () =>
    {
        fieldType === 'password' ? setFieldType('text') : setFieldType('password')
    }

    return (
        <Form title='Login' action={formAction} className='!min-w-75'>
            <FormGroup>
                <Label htmlFor='username'>Username</Label>
                <Input name='username' placeholder='Enter Username' />
                {
                    state.errors?.username && (
                        <p className="text-error">{state.errors.username[0]}</p>
                    )
                }
            </FormGroup>
            <div className='flex flex-col'>
                <Label htmlFor='password'>Password</Label>
                <PasswordInput name='password' placeholder='Enter Password' type={fieldType} onTypeChange={handleTypeChange} />
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
'use client'
import Button from '@/components/ui/Button/Button';
import Form from '@/components/ui/Form/Form';
import FormGroup from '@/components/ui/FormGroup/FormGroup';
import Input from '@/components/ui/Input/Input';
import Label from '@/components/ui/Label/Label';
import Link from 'next/link';
import React, { startTransition, useActionState, useEffect } from 'react';
import SubmitButton from '../login/SubmitButton';
import { handleUpdatePasswordAction } from './formHandler';
import { redirect, useRouter } from 'next/navigation';

const UpdatePaswordForm = ({ email }: { email: string }) =>
{
    const initialState = {
        errors: {
        }
    }
    const router = useRouter()
    const [state, formAction] = useActionState(handleUpdatePasswordAction, initialState)

    useEffect(() =>
    {
        if (state.success)
        {
            // redirect after success
            redirect('/login')
        }
    }, [state.success, router])
    return (
        <Form title='Update Password' onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault(); // prevent page reload
            if (email)
            {
                const formData = new FormData(e.currentTarget);
                console.log(formData)
                formData.append("email", email)
                startTransition(() =>
                {
                    formAction(formData); // call your useActionState handler
                })

            }
        }}>
            <p className="text-gray-700">Update your password</p>
            <div className='flex flex-col'>
                <Label htmlFor='new-password'>New Password</Label>
                <Input name='new-password' type="text" placeholder='Enter new password' autoFocus required />
                {
                    state.errors?.new_password && (
                        <p className="text-error">{state.errors.new_password[0]}</p>
                    )
                }
            </div>
            <FormGroup>
                <Label htmlFor='confirm-password'>Confirm Password</Label>
                <Input name='confirm-password' type="text" placeholder='Re-Enter new password' required />
                {
                    state.errors?.confirm_password && (
                        <p className="text-error">{state.errors.confirm_password[0]}</p>
                    )
                }
            </FormGroup>

            {
                state.success ?
                    <div className='text-success'>
                        Form Submitted Successfully</div> : <>{state.errors?.new_password}</>
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

export default UpdatePaswordForm
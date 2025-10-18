import React from 'react'
import ForgotPasswordForm from './forgotPasswordForm'

const ForgotPasswordPage = async () =>
{
    return (
        <div className='flex flex-col items-center p-30 gap-0 w-full h-screen '>
            <h2 className='text-4xl font-bold mb-10'>POFS</h2>
            <ForgotPasswordForm />
        </div>
    )
}

export default ForgotPasswordPage
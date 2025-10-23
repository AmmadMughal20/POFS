import React from 'react'
import ForgotPasswordForm from './forgotPasswordForm'
import logo from '@/assets/images/pofs_logo.svg'
import Image from 'next/image'

const ForgotPasswordPage = async () =>
{
    return (
        <div className='flex flex-col items-center p-10 gap-0 w-full h-screen '>
            <Image src={logo} width={225} height={100} alt='pofs' className='' />
            <ForgotPasswordForm />
        </div>
    )
}

export default ForgotPasswordPage
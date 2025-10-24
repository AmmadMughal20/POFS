import React from 'react'
import LoginForm from './loginForm'
import Image from 'next/image'
import logo from '@/assets/images/pofs_logo.svg'
import { Suspense } from "react";

const LoginPage = () =>
{
    return (
        <div className='flex flex-col items-center p-10 gap-0 w-full h-screen '>
            <Image src={logo} width={225} height={100} alt='pofs' className='' />
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}

export default LoginPage
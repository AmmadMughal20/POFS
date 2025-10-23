import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import UpdatePaswordForm from './updatePaswordForm'
import Image from 'next/image'
import logo from '@/assets/images/pofs_logo.svg'

const page = async () =>
{

    const otp_email = (await cookies()).get('otp_email')?.value
    if (!otp_email)
    {
        redirect('/login')
    }
    return (
        <div className='flex flex-col items-center p-10 gap-0 w-full h-screen '>
            <Image src={logo} width={225} height={100} alt='pofs' className='' />
            <UpdatePaswordForm email={otp_email} />
        </div>
    )
}

export default page
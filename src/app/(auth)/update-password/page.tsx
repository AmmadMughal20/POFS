import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import UpdatePaswordForm from './updatePaswordForm'

const page = async () =>
{

    const otp_email = (await cookies()).get('otp_email')?.value
    if (!otp_email)
    {
        redirect('/login')
    }
    return (
        <div className='flex flex-col items-center p-30 gap-0 w-full h-screen '>
            <h2 className='text-4xl font-bold mb-10'>POFS</h2>
            <UpdatePaswordForm email={otp_email} />
        </div>
    )
}

export default page
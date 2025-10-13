'use client'
import Button from '@/components/ui/Button/Button'
import { useFormStatus } from 'react-dom'
type SubmitButton = {
    title?: string
}
function SubmitButton({ title = 'Submit' }: SubmitButton)
{
    const { pending } = useFormStatus()

    return (
        <Button
            type='submit'
            disabled={pending}
            className='btn btn-primary'
        >
            {pending ? 'Please wait...' : title}
        </Button>
    )
}


export default SubmitButton
import React from 'react'

interface IForm
{
    title: string,
    action?: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
    children?: React.ReactElement[]
    className?: string
}

const Form: React.FC<IForm> = ({ title, children, action, onSubmit, className = '' }) =>
{
    return (
        <form action={action} onSubmit={onSubmit} className={`form-cl ${className}`}>
            <p className='form-title pb-5'>{title}</p>
            <div className='w-auto flex flex-col gap-3'>
                {children}
            </div>
        </form>
    )
}

export default Form
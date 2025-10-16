import React from 'react'

interface IFormgroup
{
    children: React.ReactNode
}

const FormGroup: React.FC<IFormgroup> = ({ children }) =>
{
    return (
        <div className='flex flex-col'>
            {children}
        </div>
    )
}

export default FormGroup
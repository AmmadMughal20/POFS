'use client'
import React, { ChangeEventHandler, useState } from 'react'
import Input from '../Input/Input'
import { Eye, EyeClosed } from 'lucide-react'

interface IPasswordInput
{
    name: string
    required?: boolean
    autoFocus?: boolean
    placeholder?: string
    value?: string | number,
    onChange?: ChangeEventHandler<HTMLInputElement>
    className?: '',
}

const PasswordInput = ({ name, value, onChange, className = '', placeholder = 'Enter value', autoFocus = false, required = false }: IPasswordInput) =>
{

    const [fieldType, setFieldType] = useState<'password' | 'text'>('password')

    const handleTypeChange = () =>
    {
        setFieldType(fieldType === 'password' ? 'text' : 'password')
    }
    return (
        <div className='flex items-center'>
            <Input name={name} type={fieldType} value={value} onChange={onChange} className={`w-full ${className}`} placeholder={placeholder} autoFocus={autoFocus} required={required} />
            <div onClick={handleTypeChange} className='cursor-pointer absolute ml-48'>
                {fieldType === 'password' ?
                    <EyeClosed /> :
                    <Eye />
                }
            </div>
        </div>
    )
}

export default PasswordInput
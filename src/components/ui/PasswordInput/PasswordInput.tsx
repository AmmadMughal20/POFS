import React, { ChangeEventHandler } from 'react'
import Input from '../Input/Input'
import { Eye, EyeClosed } from 'lucide-react'

interface IPasswordInput
{
    name: string
    required?: boolean
    autoFocus?: boolean
    type?: 'text' | 'number' | 'email' | 'password',
    placeholder?: string
    value?: string | number,
    onChange?: ChangeEventHandler<HTMLInputElement>
    className?: '',
    onTypeChange: () => void
}

const PasswordInput = ({ name, type = 'text', value, onChange, className = '', placeholder = 'Enter value', autoFocus = false, required = false, onTypeChange }: IPasswordInput) =>
{
    return (
        <div className='flex items-center'>
            <Input name={name} type={type} value={value} onChange={onChange} className={`w-full ${className}`} placeholder={placeholder} autoFocus={autoFocus} required={required} />
            <div onClick={onTypeChange} className='cursor-pointer absolute ml-48'>
                {type === 'password' ?
                    <EyeClosed /> :
                    <Eye />
                }
            </div>
        </div>
    )
}

export default PasswordInput
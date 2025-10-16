import React, { ChangeEventHandler } from 'react'
import Input from '../Input/Input'


interface IInputWithIcon
{
    name: string
    required?: boolean
    autoFocus?: boolean
    type?: 'text' | 'number' | 'email' | 'password',
    placeholder?: string
    value?: string | number,
    onChange?: ChangeEventHandler<HTMLInputElement>
    className?: string,
    onTypeChange?: () => void
    icon: React.ReactNode,
    iconPosition: 'left' | "right"
}
const InputWithIcon: React.FC<IInputWithIcon> = ({ name, type = 'text', value, onChange, className = '', placeholder = 'Enter value', autoFocus = false, required = false, onTypeChange, icon, iconPosition }) =>
{
    return (
        <div className={`bg-white flex min-w-50 w-auto items-center shadow rounded px-2 ${iconPosition == "right" ? 'flex-row' : "flex-row-reverse"}`}>
            <Input name={name} type={type} value={value} onChange={onChange} className={`w-full  !shadow-none ${className}`} placeholder={placeholder} autoFocus={autoFocus} required={required} />
            <div onClick={onTypeChange} className='cursor-pointer text-gray-400'>
                {icon}
            </div>
        </div>
    )
}

export default InputWithIcon
import React, { ChangeEventHandler, Dispatch, SetStateAction } from 'react'

interface IInput
{
    name: string
    required?: boolean
    autoFocus?: boolean
    type?: 'text' | 'number' | 'email' | 'password',
    placeholder?: string
    value?: string | number,
    onChange?: ChangeEventHandler<HTMLInputElement>
    className?: ''

}
const Input = ({ name, type = 'text', value, onChange, className = '', placeholder = 'Enter value', autoFocus = false, required = false }: IInput) =>
{
    return (
        <input name={name} type={type} value={value} onChange={onChange} className={`${className}`} placeholder={placeholder} autoFocus={autoFocus} required={required} />
    )
}

export default Input
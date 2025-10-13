import React from 'react'
import Label from '../Label/Label'

export interface IRadioInput
{
    name: string,
    id?: string | number,
    value: string | number,
    title: string,
    className?: string,
    checked?: boolean,
    defaultChecked?: boolean,
    disabled?: boolean,
    onChange?: (value: string | number) => void
}
const RadioInput: React.FC<IRadioInput> = ({ name, id, value, title, defaultChecked = false, className = '', disabled = false, onChange }) =>
{
    const handleChange = () =>
    {
        onChange?.(value)
    }
    return (
        <Label htmlFor={String(id ?? value)} className='flex gap-2 shadow-none cursor-pointer justify-left items-center'>
            <input name={name} type='radio' id={String(id ?? value)} value={value} className={`cursor-pointer accent-primary ${className}`} defaultChecked={defaultChecked} disabled={disabled} onChange={handleChange} />
            {title}
        </Label>
    )
}

export default RadioInput
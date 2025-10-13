import React from 'react'
import Label from '../Label/Label'

export interface ICheckBoxInput
{
    name: string,
    title: string,
    value: string | number,
    defaultChecked?: boolean,
    disabled?: boolean,
    className?: '',
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const CheckBoxInput: React.FC<ICheckBoxInput> = ({ name, value, title, defaultChecked = false, disabled = false, className = '', onChange }) =>
{
    return (
        <div className='flex gap-2 items-center'>
            <input
                type='checkbox'
                name={name}
                defaultChecked={defaultChecked}
                value={value}
                disabled={disabled}
                className={`accent-primary ${className}`}
                onChange={onChange}
            />
            <Label htmlFor={name}>{title}</Label>
        </div>
    )
}

export default CheckBoxInput
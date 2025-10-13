import React, { useState } from 'react'
import { ICheckBoxInput } from '../CheckBoxInput/CheckBoxInput'
import Label from '../Label/Label'


interface ICheckBoxGroup
{
    children: React.ReactElement<ICheckBoxInput>[]
    title: string
    required?: boolean             // true = at least one must be checked
    name: string                   // group name for checkboxes
    direction?: 'vertical' | 'horizontal'
    className?: string
    onChange?: (selectedValues: (string | number)[]) => void
}

const CheckBoxGroup: React.FC<ICheckBoxGroup> = ({
    children,
    title,
    required = false,
    name,
    direction = 'vertical',
    className = '',
    onChange
}) =>
{
    const [selectedValues, setSelectedValues] = useState<(string | number)[]>([])

    const handleChange = (value: string | number, checked: boolean) =>
    {
        setSelectedValues(prev =>
        {
            let updatedValues: (string | number)[]

            if (checked)
            {
                updatedValues = [...prev, value]
            } else
            {
                updatedValues = prev.filter(v => v !== value)
            }

            // Prevent unchecking all if required
            if (required && updatedValues.length === 0)
            {
                return prev
            }

            onChange?.(updatedValues)
            return updatedValues
        })
    }

    return (
        <>
            <Label htmlFor={name}>{title}</Label>
            <div
                className={`checkbox-group ${direction === 'vertical' ? 'flex-col gap-2' : 'flex-row gap-4'
                    } ${className}`}
            >
                {children.map(child =>
                {
                    const value = child.props.value
                    const checked = selectedValues.includes(value)

                    return React.cloneElement(child, {
                        name,
                        key: value,
                        defaultChecked: checked,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(value, e.target.checked),
                    })
                })}
            </div>
        </>

    )
}

export default CheckBoxGroup
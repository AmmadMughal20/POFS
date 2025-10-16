import { ChangeEventHandler } from 'react'

interface IInput
{
    name: string
    required?: boolean
    autoFocus?: boolean
    type?: 'text' | 'number' | 'email' | 'password' | "time",
    placeholder?: string
    value?: string | number,
    onChange?: ChangeEventHandler<HTMLInputElement>
    className?: string,
    disabled?: boolean,
    readOnly?: boolean,
    defaultValue?: string | number

}
const Input = ({ name, type = 'text', value, onChange, className = '', placeholder = 'Enter value', autoFocus = false, required = false, disabled = false, defaultValue, readOnly }: IInput) =>
{
    const isControlled = value !== undefined // ✅ explicit check

    return (
        <input
            name={name}
            type={type}
            {...(isControlled
                ? { value, onChange } :
                { defaultValue }
            )}
            onChange={onChange}
            className={`${className}`}
            placeholder={placeholder}
            autoFocus={autoFocus}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
        />
    )
}

export default Input
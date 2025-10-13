import React from 'react'

export interface IButton
{
    children: string | React.ReactNode
    className?: string
    variant?: 'primary' | 'secondary'
    size?: 'small' | 'medium' | 'large'
    onClick?: () => void,
    type?: 'submit' | 'reset' | 'button'
    disabled?: boolean
}

const Button: React.FC<IButton> = ({ children, className = '', variant = 'primary', size = 'medium', onClick, type = 'submit', disabled = false }) =>
{
    return (
        <button onClick={onClick} className={`btn btn-${variant} btn-${size} ${className}`} type={type} disabled={disabled}>
            {children}
        </button>
    )
}

export default Button
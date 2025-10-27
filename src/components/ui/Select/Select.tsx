import React from 'react';
import styles from './Select.module.css';

interface ISelect
{
    name: string,
    children: React.ReactNode,
    className?: string,
    required?: boolean,
    autoFocus?: boolean,
    disabled?: boolean
}
const Select: React.FC<ISelect> = ({ name, children, className = '', required = true, autoFocus = false, disabled = false }: ISelect) =>
{
    return (
        <select className={`${styles.select} ${className}`} name={name} required={required} autoFocus={autoFocus} disabled={disabled}>
            {children}
        </select>
    )
}

export default Select
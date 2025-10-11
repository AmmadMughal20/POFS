import React from 'react'

interface ILabel
{
    children: string,
    className?: string
    htmlFor: string
}

const Label: React.FC<ILabel> = ({ children, className, htmlFor }) =>
{
    return (
        <label className={`${className}`} htmlFor={htmlFor}>{children}</label>
    )
}

export default Label
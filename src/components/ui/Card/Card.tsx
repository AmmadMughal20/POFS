import React from 'react'
export interface ICard
{
    children?: React.ReactElement | React.ReactElement[]
    className?: string
}
const Card: React.FC<ICard> = ({ children, className = '' }) =>
{
    return (
        <div className={`rounded min-h-5 min-w-5 shadow-md p-5 ${className}`}>{children}</div>
    )
}

export default Card
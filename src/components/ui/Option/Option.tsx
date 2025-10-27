import React from 'react'

interface IOption
{
    title?: string,
    value?: string | number
}
const Option = ({ value = '', title = 'Select Option' }: IOption) =>
{
    return (
        <option value={value}>
            {title}
        </option>
    )
}

export default Option
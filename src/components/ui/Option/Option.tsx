import React from 'react'

interface IOption
{
    title?: string,
    key?: string | number,
    value?: string | number
}
const Option = ({ key, value = '', title = 'Select Option' }: IOption) =>
{
    return (
        <option key={key} value={value}>
            {title}
        </option>
    )
}

export default Option
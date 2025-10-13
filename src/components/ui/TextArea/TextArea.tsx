import React from 'react'


export interface ITextArea
{
    name: string
    rows?: number
    columns?: number
}
const TextArea: React.FC<ITextArea> = ({ name, rows = 5, columns = 5 }) =>
{
    return (
        <textarea name={name} rows={rows} cols={columns} />
    )
}

export default TextArea
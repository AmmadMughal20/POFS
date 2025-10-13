import React from 'react'
import { IRadioInput } from '../RadioInput/RadioInput'
import Label from '../Label/Label'
interface IRadioGroup
{
  title: string
  name: string
  children: React.ReactElement<IRadioInput>[],
  direction?: 'vertical' | 'horizontal'
  selectedValue?: string | number
  onChange?: (value: string | number) => void
}
const RadioGroup: React.FC<IRadioGroup> = ({
  title,
  name,
  children,
  direction = 'vertical',
  selectedValue,
  onChange }) =>
{
  return (
    <>
      <Label htmlFor={name}>{title}</Label>
      <div className={`radio-group ${direction == 'vertical' ? 'flex flex-col' : 'flex flex-row'}`}>
        {children.map((child) =>
          React.cloneElement(child, {
            name,
            checked: child.props.value === selectedValue,
            onChange
          })
        )}
      </div>
    </>
  )
}

export default RadioGroup
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, Select, MenuItem, Switch, Checkbox, FormControl, InputLabel } from '@mui/material'

export default function Form({ defaultValues, children, onSubmit }) {
  const methods = useForm({ defaultValues })

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      {React.Children.map(children, child => {
        if (child.props.name) {
          const { name, ...rest } = child.props
          const Component =
            child.type === Input
              ? TextField
              : child.type === Select
              ? Select
              : child.type === Switch
              ? Switch
              : child.type === Checkbox
              ? Checkbox
              : null

          if (Component) {
            return (
              <FormControl fullWidth variant='outlined'>
                {(child.type === 'SelectInput' || 'SwitchInput' || 'CheckboxInput') && (
                  <InputLabel>{child.props.label}</InputLabel>
                )}
                <Controller
                  name={name}
                  control={methods.control}
                  defaultValue=''
                  render={({ field }) => <Component {...field} {...rest} />}
                />
              </FormControl>
            )
          }
        }

        return child
      })}
    </form>
  )
}

export function Input(props) {
  return <TextField {...props} />
}

export function SelectInput({ options, ...rest }) {
  return (
    <Select {...rest}>
      {options.map((option, optionIndex) => (
        <MenuItem key={optionIndex} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  )
}

export function SwitchInput(props) {
  return <input type='checkbox' {...props} />
}

export function CheckboxInput(props) {
  return <input type='checkbox' {...props} />
}

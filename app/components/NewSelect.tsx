import React from 'react'
import * as Select from '@radix-ui/react-select'

export interface SelectOption {
  label: string
  value: string
}

export interface NewSelectProps {
  value?: string
  onChange?: (value: string) => void
  options: SelectOption[]
  atLeastOneOptionSelected?: boolean
}

const triggerStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  backgroundColor: 'white',
  minWidth: '150px',
  cursor: 'pointer'
}

const contentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '4px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  border: '1px solid #eee',
  padding: '4px'
}

const itemStyle: React.CSSProperties = {
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  outline: 'none'
}

const indicatorStyle: React.CSSProperties = {
  marginLeft: 'auto',
  paddingLeft: '12px'
}

const NewSelect = ({value, onChange, options, atLeastOneOptionSelected}: NewSelectProps) => {
  return (
    <Select.Root value={value} onValueChange={onChange} required={atLeastOneOptionSelected}>
      <Select.Trigger style={triggerStyle}>
        <Select.Value placeholder="Seleziona..." />
        <Select.Icon>▼</Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content style={contentStyle}>
          <Select.Viewport>
            {options.map(option => (
              <Select.Item key={option.value} value={option.value} style={itemStyle}>
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator style={indicatorStyle}>✓</Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export {NewSelect}

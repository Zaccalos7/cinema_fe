import {useState} from 'react'
import {NewDiv, NewIcon, NewLabel, sizes} from '~/components'
import {RadioGroup, RadioGroupItem} from './ui/radioGroup'
import {cn} from '~/libs/cn'
import {type IconName} from '../../types/icons'

export interface RadioIconProps {
  className?: string
  iconName: IconName
  size?: keyof typeof sizes | number
}

export interface RadioItem {
  value: string
  label: string
  radioIconProps?: RadioIconProps
}

interface NewRadioGroupProps {
  name?: string
  options: RadioItem[]
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  fakeLabel?: boolean
  defaultValue?: string
  value?: string
  className?: string
  labelClassName?: string
  buttonClassName?: string
}

const RadioGroupInnerComponent = ({
  orientation = 'vertical',
  onValueChange,
  options,
  name,
  value,
  className,
  buttonClassName,
  labelClassName
}: Omit<NewRadioGroupProps, 'fakeLabel' | 'defaultValue'> & {
  value: string
}) => {
  return (
    <>
      {name && <input type="hidden" name={name} value={value} />}

      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row items-center gap-6' : 'flex-col gap-3',
          className
        )}
      >
        {options.map(({value: optionValue, label, radioIconProps}) => {
          const id = `radio-${name ?? 'group'}-${optionValue}`

          return (
            <div key={optionValue} className="flex items-center gap-2">
              <RadioGroupItem
                id={id}
                value={optionValue}
                className={cn('shrink-0', buttonClassName)}
              />

              <NewLabel
                htmlFor={id}
                className={cn(
                  'flex items-center gap-2 cursor-pointer leading-none',
                  labelClassName
                )}
              >
                {radioIconProps && (
                  <NewIcon
                    name={radioIconProps.iconName}
                    size={radioIconProps.size}
                    className={cn('inline-block align-middle', radioIconProps.className)}
                  />
                )}

                <span className="align-middle">{label}</span>
              </NewLabel>
            </div>
          )
        })}
      </RadioGroup>
    </>
  )
}

const NewRadioButtons = ({
  options,
  onValueChange,
  orientation = 'vertical',
  fakeLabel,
  name,
  defaultValue = '',
  value,
  className,
  buttonClassName,
  labelClassName
}: NewRadioGroupProps) => {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)

  const currentValue = isControlled ? value! : internalValue

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }

    onValueChange?.(newValue)
  }

  if (fakeLabel) {
    return (
      <NewDiv justify="end" style={{paddingBottom: 5.5}}>
        <NewLabel className="invisible">&nbsp;</NewLabel>

        <NewDiv>
          <RadioGroupInnerComponent
            orientation={orientation}
            value={currentValue}
            onValueChange={handleChange}
            options={options}
            name={name}
            className={className}
            buttonClassName={buttonClassName}
            labelClassName={labelClassName}
          />
        </NewDiv>
      </NewDiv>
    )
  }

  return (
    <RadioGroupInnerComponent
      orientation={orientation}
      value={currentValue}
      onValueChange={handleChange}
      options={options}
      name={name}
      className={className}
      buttonClassName={buttonClassName}
      labelClassName={labelClassName}
    />
  )
}

export {NewRadioButtons}

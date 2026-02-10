import {cva} from 'class-variance-authority'
import React, {useId, type ComponentPropsWithRef} from 'react'

import {cn} from '~/libs/cn'
import {Label} from '~/components/ui/label'
import {Input} from '~/components/ui/input'

type NumericFontSizeStyle = Omit<React.CSSProperties, 'fontSize'> & {
  fontSize?: number
}

interface NewInputProps extends ComponentPropsWithRef<'input'> {
  style?: NumericFontSizeStyle
  type?: HTMLInputElement['type']
  id?: string
  disabled?: boolean
  label?: string
  placeholder?: string
  name?: string
  containerClassName?: string
  error?: boolean
  setValue?: (value: string) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /**
   * as of now, chrome derived browsers will show the X, on firefox the button needs to be styled, todo maybe?
   */
  clearButton?: boolean
  hidden?: boolean
  submitOnEnterKeyPressed?: boolean
  /**
   * if true, an asterisk will be added to the label,
   * indicating that the field is required
   * THIS IS PURELY VISIBLE, no validation is done
   */
  labelAsterisk?: boolean
  fakeLabel?: boolean
}

const Wrapper = ({
  hidden,
  containerClassName,
  children,
  label,
  id,
  generatedId,
  fakeLabel
}: {
  hidden: boolean
  containerClassName?: string
  children: React.ReactNode
  label?: string
  id?: string
  generatedId?: string
  fakeLabel?: boolean
}) => {
  if (hidden) {
    return <>{children}</>
  }

  const containerDefaultClassName = cva(
    label || fakeLabel
      ? 'flex flex-col w-full gap-1.5'
      : 'rounded-md bg-white dark:bg-gray-800 w-full'
  )

  return (
    <div className={cn(containerDefaultClassName(), containerClassName)}>
      {(label || fakeLabel) && (
        <Label
          className={fakeLabel ? 'invisible' : 'font-semibold'}
          htmlFor={id || generatedId}
          ref={undefined}
        >
          {label || '&nbsp;'}
        </Label>
      )}
      {children}
    </div>
  )
}

const NewInput = ({
  ref,
  type = 'text',
  id,
  disabled,
  label,
  placeholder,
  name,
  containerClassName = '',
  error,
  setValue,
  onChange,
  clearButton,
  hidden,
  style,
  labelAsterisk,
  fakeLabel,
  submitOnEnterKeyPressed = true,
  ...props
}: NewInputProps & {
  ref?: React.RefObject<HTMLInputElement | null>
}) => {
  const generatedId = useId()

  const computedFontSize =
    typeof style?.fontSize === 'number' && style.fontSize >= 16 ? style.fontSize : 16

  if (label && labelAsterisk) {
    label = label + ' *'
  }

  return (
    <Wrapper
      hidden={Boolean(hidden)}
      label={label}
      containerClassName={containerClassName}
      id={id}
      generatedId={generatedId}
      fakeLabel={fakeLabel}
    >
      <Input
        ref={ref}
        style={{
          ...style,
          // keep a minimum of 16 because of iOS
          fontSize: computedFontSize
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter' && !submitOnEnterKeyPressed) {
            e.preventDefault()
          }
        }}
        name={name}
        disabled={disabled}
        type={type === 'text' && clearButton ? 'search' : type}
        placeholder={placeholder}
        id={id || generatedId}
        hidden={Boolean(hidden)}
        className={
          hidden
            ? ''
            : `${
                error ? ' ring-2 ring-red-600 focus-visible:ring-2 focus-visible:ring-red-600' : ''
              }`
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (setValue) {
            setValue(e.target.value)
          }
          if (onChange) {
            onChange(e)
          }
        }}
        {...props}
      />
    </Wrapper>
  )
}

NewInput.displayName = 'NewInput'

export {NewInput}

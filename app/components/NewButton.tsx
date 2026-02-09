import {HtmlHTMLAttributes, useId} from 'react'
import NewTooltip from './NewTooltip'
import {Button} from './ui/button'
import {cn} from '~/libs/cn'
import NewIcon from './NewIcon'

interface NewButtonBaseProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'success'
    | 'warning'
  label?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  className?: string
  type: 'button' | 'submit' | 'reset'
  name?: string
  fullWidth?: boolean
  iconName?: NewIconNames
  iconPosition?: 'left' | 'right'
  isBold?: boolean
  truncate?: boolean
  isUpperCase?: boolean
  style?: React.CSSProperties
  fullSpaceWithIcon?: boolean
  fontSize?: keyof typeof fontSizesClassNames
  tooltip?: string
  isLoading?: boolean
  labelClassName?: string
  ref?: React.RefObject<HTMLButtonElement | null>
}

const fontSizesClassNames = {
  smaller: 'text-[14px]',
  small: 'text-[16px]',
  medium: 'text-[24px]',
  large: 'text-[32px]',
  huge: 'text-[64px]'
}

const NewButton = ({
  className,
  fullWidth,
  name,
  type,
  variant = 'default',
  style,
  tooltip,
  isBold,
  isUpperCase,
  truncate = false,
  ref,
  iconPosition,
  labelClassName,
  isLoading,
  iconName,
  fontSize = 'medium',
  onClick,
  ...props
}: NewButtonBaseProps & {}) => {
  const dataTarget = useId()

  return (
    <NewTooltip tooltipContent={tooltip || null}>
      <Button
        {...props}
        data-target={dataTarget}
        ref={ref}
        name={name}
        type={type}
        className={cn(
          `select-none ${isBold && 'font-bold'} ${isUpperCase && 'uppercase'} h-auto ${fullWidth ? 'w-full' : 'w-fit'}`,
          className
        )}
        variant={variant}
        style={{
          ...{
            ...style
          }
        }}
        onClick={onClick}
      >
        <span
          className={`flex gap-2 items-center justify-center  w-full
        ${iconPosition === 'right' ? 'flex-row-reverse' : ''}
        `}
        >
          {isLoading && (
            <Loader2
              data-testid="loader"
              className={` ${label ? 'mr-2' : ''} h-4 w-4 animate-spin`}
            />
          )}
          {iconName && !isLoading && (
            <NewIcon fill={iconFill} data-testid="icon" size={fontSize} name={iconName} />
          )}
          {label && (
            <span
              data-testid="label"
              className={cn(
                fontSizesClassNames[fontSize],
                labelClassName,
                `${truncate ? 'truncate inline-block' : ''}`
              )}
              style={{
                marginLeft: iconName && iconPosition === 'left' ? '0.25rem' : '',
                marginRight: iconName && iconPosition === 'right' ? '0.25rem' : '',
                ...(fullSpaceWithIcon && {width: '100%'})
              }}
            >
              {label}
            </span>
          )}
        </span>
      </Button>
    </NewTooltip>
  )
}

export default NewButton

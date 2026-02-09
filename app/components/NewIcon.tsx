import * as Icons from 'lucide-react'
import React, {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type Ref,
  forwardRef
} from 'react'

import {type IconName} from '../../types/icons'

import {cn} from '~/libs/cn'
import NewTooltip from './NewTooltip'

const sizes = {
  smaller: 14,
  small: 16,
  medium: 24,
  large: 32,
  huge: 64
} as const

export interface NewIconProps {
  name: IconName
  color?: string
  size?: keyof typeof sizes | number
  style?: CSSProperties
  disabled?: boolean
  pointer?: boolean
  onClick?: (event: ReactMouseEvent<SVGSVGElement>) => void
  className?: string
  hoverable?: boolean
  tooltip?: string
  fill?: string
}

const kebabToPascal = (str: string) =>
  str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const NewIcon = forwardRef<SVGSVGElement, NewIconProps>(
  (
    {
      name,
      color,
      size = 'medium',
      style,
      disabled,
      hoverable,
      pointer,
      onClick,
      className,
      tooltip,
      fill,
      ...props
    },
    ref: Ref<SVGSVGElement>
  ) => {
    const iconKey = kebabToPascal(name)
    const Icon = (Icons as unknown as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>)[
      iconKey
    ]

    if (!Icon) {
      console.warn(`Icon "${name}" not found in lucide-react`)
      return null
    }

    const baseClassName = hoverable ? 'hover:contrast-50' : ''
    const finalClassName = cn(baseClassName, className, 'focus:outline-none')

    return (
      <NewTooltip tooltipContent={tooltip || null}>
        <Icon
          ref={ref}
          className={finalClassName}
          color={color}
          //@ts-expect-error to be checked later
          size={typeof size === 'number' ? size : sizes[size]}
          style={{
            ...style,
            ...(pointer && {cursor: 'pointer'}),
            ...(disabled && {
              color: 'rgba(0, 0, 0, 0.26)',
              cursor: 'not-allowed'
            })
          }}
          {...(!disabled && onClick && {onClick})}
          {...(fill && {fill})}
          {...props}
        />
      </NewTooltip>
    )
  }
)

NewIcon.displayName = 'NewIcon'

export {IconName as IconNames, NewIcon}

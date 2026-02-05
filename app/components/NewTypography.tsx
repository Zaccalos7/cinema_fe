import {cn} from '~/libs/cn'

export interface NewTypographyProps {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body1'
    | 'body2'
    | 'body3'
    | 'caption'
    | 'p'
    | 'blockquote'
    | 'inlineCode'
    | 'lead'
    | 'large'
    | 'small'
    | 'muted'
    | 'custom'
  color?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'white' | 'black'
  className?: string
  bold?: boolean
  uppercase?: boolean
  inLine?: boolean
  asLink?: boolean
  children: React.ReactNode
  ref?: any
  style?: React.CSSProperties
  onClick?: () => void
}

const colorsMapper = {
  default: 'text-primary',
  secondary: 'text-secondary',
  destructive: 'text-destructive',
  success: 'text-success',
  warning: 'text-warning',
  white: 'text-white',
  black: 'text-black'
}

const wrapperJsx: {
  [key: string]: React.FC<any>
} = {
  h1: ({children, ref, computedAdditionalClassName}) => {
    const mergedClassNames = cn([
      'scroll-m-20 text-4xl font-extrabold tracking-tight',
      computedAdditionalClassName
    ])

    return (
      <h1 ref={ref} className={mergedClassNames}>
        {children}
      </h1>
    )
  }
}

const NewTypography = ({
  variant = 'body2',
  className,
  children,
  ref,
  style,
  bold,
  color,
  uppercase,
  inLine,
  asLink
}: NewTypographyProps) => {
  const additionalClassNames: String[] = []

  if (bold !== undefined) {
    if (bold) {
      additionalClassNames.push('font-bold')
    } else {
      additionalClassNames.push('font-normal')
    }
  }

  if (color) {
    additionalClassNames.push(colorsMapper[color])
  }

  if (uppercase) {
    additionalClassNames.push('uppercase')
  }

  if (inLine) {
    additionalClassNames.push('inline')
  }

  if (asLink) {
    additionalClassNames.push('cursor-pointer text-primary hover:text-primary/80 hover:underline')
  }

  let computedAdditionalClassName = additionalClassNames.join(' ')
  computedAdditionalClassName += ` ${className}`

  return wrapperJsx[variant]({children, ref, computedAdditionalClassName})
}

export default NewTypography

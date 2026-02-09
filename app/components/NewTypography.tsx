import {Children} from 'react'
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
  h1: ({children, ref, computedAdditionalClassName, onClick, style}) => {
    const mergedClassNames = cn([
      'scroll-m-20 text-4xl font-extrabold tracking-tight',
      computedAdditionalClassName
    ])

    return (
      <h1 ref={ref} className={mergedClassNames} onClick={onClick} style={style}>
        {children}
      </h1>
    )
  },

  h2: ({children, ref, computedAdditionalClassName, onClick, style}) => {
    const mergedClassNames = cn([
      'scroll-m-20 text-4xl font-extrabold tracking-tight',
      computedAdditionalClassName
    ])
    return (
      <h2 ref={ref} className={mergedClassNames} onClick={onClick} style={style}>
        {children}
      </h2>
    )
  },

  h3: ({children, ref, computedAdditionalClassName, onClick, style}) => {
    const mergedClassNames = cn([
      'scroll-m-20 text-4xl font-extrabold tracking-tight',
      computedAdditionalClassName
    ])
    return (
      <h3 className={mergedClassNames} ref={ref} onClick={onClick} style={style}>
        {children}
      </h3>
    )
  },

  h4: ({children, ref, computedAdditionalClassName, onClick, style}) => {
    const mergedClassNames = cn([
      'scroll-m-20 text-4xl font-extrabold tracking-tight',
      computedAdditionalClassName
    ])
    return (
      <h4 className={mergedClassNames} ref={ref} onClick={onClick} style={style}>
        {children}
      </h4>
    )
  },

  h5: ({children, ref, computedAdditionalClassName, onClick, style}) => {
    const mergedClassNames = cn([
      'scroll-m-20 text-4xl font-extrabold tracking-tight',
      computedAdditionalClassName
    ])
    return (
      <h5 className={mergedClassNames} ref={ref} onClick={onClick} style={style}>
        {children}
      </h5>
    )
  },
  h6: ({children, ref, computedAdditionalClassName, onClick, style}) => {
    const mergedClassNames = cn([
      'scroll-m-20 text-4xl font-extrabold tracking-tight',
      computedAdditionalClassName
    ])
    return (
      <h6 className={mergedClassNames} ref={ref} onClick={onClick} style={style}>
        {children}
      </h6>
    )
  },

  p: ({children, computedAdditionalClassNames, style, onClick, ref}) => {
    const mergedClassNames = cn([
      'leading-7 [&:not(:first-child)]:mt-6',
      computedAdditionalClassNames
    ])

    return (
      <p ref={ref} onClick={onClick} className={mergedClassNames} style={style}>
        {children}
      </p>
    )
  },
  blockquote: ({children, computedAdditionalClassNames, style, onClick, ref}) => {
    const mergedClassNames = cn(['mt-6 border-l-2 pl-6 italic', computedAdditionalClassNames])

    return (
      <blockquote ref={ref} onClick={onClick} className={mergedClassNames} style={style}>
        {children}
      </blockquote>
    )
  },
  inlineCode: ({children, computedAdditionalClassNames, style, onClick, ref}) => {
    const mergedClassNames = cn([
      'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      computedAdditionalClassNames
    ])

    return (
      <code ref={ref} onClick={onClick} className={mergedClassNames} style={style}>
        {children}
      </code>
    )
  },
  lead: ({children, computedAdditionalClassNames, style, onClick, ref}) => {
    const mergedClassNames = cn(['text-xl text-muted-foreground', computedAdditionalClassNames])

    return (
      <p ref={ref} onClick={onClick} className={mergedClassNames} style={style}>
        {children}
      </p>
    )
  },
  large: ({children, computedAdditionalClassNames, style, onClick, ref}) => {
    const mergedClassNames = cn(['text-lg font-semibold', computedAdditionalClassNames])

    return (
      <span ref={ref} onClick={onClick} className={mergedClassNames} style={style}>
        {children}
      </span>
    )
  },
  small: ({children, computedAdditionalClassNames, style, onClick, ref}) => {
    const mergedClassNames = cn(['text-sm font-medium leading-none', computedAdditionalClassNames])

    return (
      <small ref={ref} onClick={onClick} className={mergedClassNames} style={style}>
        {children}
      </small>
    )
  },
  muted: ({children, computedAdditionalClassNames, style, onClick, ref}) => {
    const mergedClassNames = cn(['text-sm text-muted-foreground', computedAdditionalClassNames])

    return (
      <span ref={ref} onClick={onClick} className={mergedClassNames} style={style}>
        {children}
      </span>
    )
  },
  body1: ({children, computedAdditionalClassNames, style, onClick, ref}) => {
    const mergedClassNames = cn(['text-base', computedAdditionalClassNames])

    return (
      <span ref={ref} onClick={onClick} className={mergedClassNames} style={style}>
        {children}
      </span>
    )
  },
  body2: ({children, computedAdditionalClassNames, style, onClick, ref}) => {
    const mergedClassNames = cn(['text-sm', computedAdditionalClassNames])

    return (
      <span ref={ref} onClick={onClick} className={mergedClassNames} style={style}>
        {children}
      </span>
    )
  },
  body3: ({children, computedAdditionalClassNames, style, onClick, ref}) => {
    const mergedClassNames = cn(['text-xs', computedAdditionalClassNames])

    return (
      <span ref={ref} onClick={onClick} className={mergedClassNames} style={style}>
        {children}
      </span>
    )
  },
  caption: ({children, computedAdditionalClassNames, style, onClick, ref}) => {
    const mergedClassNames = cn(['leading-5 text-xs text-gray-600', computedAdditionalClassNames])

    return (
      <p ref={ref} onClick={onClick} className={mergedClassNames} style={style}>
        {children}
      </p>
    )
  },
  custom: ({children, computedAdditionalClassNames, style, onClick, ref}) => {
    const mergedClassNames = cn([computedAdditionalClassNames])

    return (
      <span ref={ref} onClick={onClick} className={mergedClassNames} style={style}>
        {children}
      </span>
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
  asLink,
  onClick
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

  return wrapperJsx[variant]({children, ref, computedAdditionalClassName, style, onClick})
}

export {NewTypography}

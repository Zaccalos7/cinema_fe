import {cn} from '~/libs/cn'

type NewDivProps = {
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  center?: boolean
  bordered?: boolean
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch' | 'normal'
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline' | 'normal'
  backgroundColor?: 'success' | 'warning' | 'destructive'
}

const directionValuesMap = {
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'row-reverse',
  'column-reverse': 'column-reverse'
}

const justifyValuesMap = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
  stretch: 'justify-stretch',
  normal: 'justify-normal'
}

const alignValuesMap = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
  normal: 'items-normal'
}

const backgroundColorValuesMap = {
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive'
}

const NewDiv = ({
  className = '',
  children,
  style,
  direction = 'row',
  center = false,
  justify = 'normal',
  align = 'normal',
  backgroundColor,
  bordered = false
}: NewDivProps) => {
  const computedClassName = [
    'flex',
    directionValuesMap[direction],
    center ? 'justify-center items-center' : '',
    !center ? `${justifyValuesMap[justify]}` : '',
    !center ? `${alignValuesMap[align]}` : '',
    backgroundColor ? backgroundColorValuesMap[backgroundColor] : '',
    bordered ? 'border border-gray-200 rounded-md' : ''
  ]
  return (
    <div className="contents">
      <div className={cn(computedClassName, className)} style={{...style}}>
        {children}
      </div>
    </div>
  )
}

export {NewDiv}

import {cn} from '~/libs/cn'

type NewDivProps = {
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

const NewDiv = ({className = '', children, style}: NewDivProps) => {
  return (
    <div className="contents">
      <div className={cn(className)} style={{...style}}>
        {children}
      </div>
    </div>
  )
}

export {NewDiv}

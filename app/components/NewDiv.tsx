import {cn} from '~/libs/cn'

type NewDivProps = {
  className?: string
  children?: React.ReactNode
}

const NewDiv = ({className = '', children}: NewDivProps) => {
  return (
    <div className="contents">
      <div className={cn(className)}>{children}</div>
    </div>
  )
}

export {NewDiv}

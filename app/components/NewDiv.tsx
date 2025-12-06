type NewDivProps = {
  className?: string
  children?: React.ReactNode
}

const NewDiv = ({className = '', children}: NewDivProps) => {
  return (
    <div className="contents">
      <div>{children}</div>
    </div>
  )
}

export {NewDiv}

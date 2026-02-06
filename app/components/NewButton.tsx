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
  iconPosition?: 'left' | 'right'
  isBold?: boolean
  style?: React.CSSProperties
  fullSpaceWithIcon?: boolean
  fakeLabel?: boolean
  tooltip?: string
  isLoading?: boolean
  labelClassName?: string
}

const NewButton = ({variant}: NewButtonBaseProps) => {}

export default NewButton

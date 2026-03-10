import {Loader2} from 'lucide-react'
import {cn} from '~/libs/cn'

const sizeMap = {
  extraSmall: 'h-2 w-2',
  small: 'h-4 w-4',
  medium: 'h-8 w-8',
  large: 'h-16 w-16',
  extraLarge: 'h-32 w-32'
}

interface NewSpinnerProps {
  className?: string
  size?: 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge'
  color?: 'yellow' | 'red' | 'green' | 'black' | 'violet'
}

const NewSpinner = ({size = 'medium', className, color = 'violet'}: NewSpinnerProps) => {
  return <Loader2 className={cn(`animate-spin ${sizeMap[size]}`, className)} color={color} />
}

export {NewSpinner}

import * as LabelPrimitive from '@radix-ui/react-label'
import {cva} from 'class-variance-authority'
import {cn} from '~/libs/cn'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

type LabelProps = {
  ref?: React.RefObject<HTMLLabelElement>
  className?: string
}

const Label = ({ref, className, ...props}: LabelProps) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
)
Label.displayName = LabelPrimitive.Root.displayName

export {Label}

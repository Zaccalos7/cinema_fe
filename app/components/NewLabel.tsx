import { cn } from "~/libs/cn"
import { Label } from "./ui/label"

interface NewLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {}

const NewLabel = ({
  className,
  ref,
  ...props
}: NewLabelProps & {
  ref?: React.RefObject<HTMLLabelElement | null>
}) => {
  return <Label className={cn('font-semibold', className)} ref={ref} {...props} />
}

export {NewLabel}
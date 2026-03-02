import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { ComponentPropsWithoutRef, ComponentRef, ElementRef, RefObject } from "react"
import { cn } from "~/libs/cn"


const RadioGroupItem = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
  ref?: RefObject<ComponentRef<typeof RadioGroupPrimitive.Item> | null>
}) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <span className="aspect-square h-[70%] w-[70%] bg-primary rounded-full  shadow focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50 mx-auto my-auto" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

const RadioGroup = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
  ref?: RefObject<ComponentRef<typeof RadioGroupPrimitive.Root> | null>
}) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />
}
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

export {RadioGroup, RadioGroupItem}
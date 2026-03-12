import { HTMLAttributes, RefObject } from "react"
import { cn } from "~/libs/cn"

const Card = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  ref?: RefObject<HTMLDivElement | null>
}) => (
  <div
    ref={ref}
    className={cn('rounded-xl border bg-card text-card-foreground shadow', className)}
    {...props}
  />
)
Card.displayName = 'Card'

const CardHeader = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  ref?: RefObject<HTMLDivElement | null>
}) => <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
CardHeader.displayName = 'CardHeader'

const CardTitle = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & {
  ref?: RefObject<HTMLParagraphElement | null>
}) => (
  <h3 ref={ref} className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
)
CardTitle.displayName = 'CardTitle'

const CardDescription = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & {
  ref?: RefObject<HTMLParagraphElement | null>
}) => <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
CardDescription.displayName = 'CardDescription'

const CardContent = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  ref?: RefObject<HTMLDivElement | null>
}) => <div ref={ref} className={cn('p-6', className)} {...props} />
CardContent.displayName = 'CardContent'

const CardFooter = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  ref?: RefObject<HTMLDivElement | null>
}) => <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
CardFooter.displayName = 'CardFooter'

export {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle}
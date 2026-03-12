import {cn} from '~/libs/cn'
import {NewDiv} from './NewDiv'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from './ui/card'

interface NewCardProps {
  width?: string | number
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

const NewCard = ({width, title, description, children, footer, className}: NewCardProps) => {
  return (
    <Card className={cn('w-full overflow-hidden gap-2', className)} style={{...(width && {width})}}>
      <NewDiv className={cn('w-full flex flex-col', className)} align="start" justify="start">
        {(title || description) && (
          <CardHeader className="p-2 flex flex-col w-full">
            {title && (
              <CardTitle className="w-full break-words text-base font-semibold text-center">
                {title}
              </CardTitle>
            )}

            {description && (
              <CardDescription className="w-full text-sm text-muted-foreground break-words">
                {description}
              </CardDescription>
            )}
          </CardHeader>
        )}

        {children && <CardContent className="p-2 w-full">{children}</CardContent>}

        {footer && <CardFooter className="p-2 w-full">{footer}</CardFooter>}
      </NewDiv>
    </Card>
  )
}

export {NewCard}

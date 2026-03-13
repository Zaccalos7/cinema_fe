import {cn} from '~/libs/cn'
import {NewDiv} from './NewDiv'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from './ui/card'

interface NewCardProps {
  width?: string | number
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string,
  titleSize?: keyof typeof TitleSizeConst
}

const TitleSizeConst = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
  extraLarge: 'text-xl'
}

const NewCard = ({width, title, description, children, footer, className, titleSize}: NewCardProps ) => {
  return (
    <Card
      className={cn('w-full h-full overflow-hidden flex flex-col gap-2 ', className)}
      style={{...(width && {width})}}
    >
      <NewDiv className="w-full h-full flex flex-col flex-1 " align="start" justify="start">
        {(title || description) && (
          <CardHeader className="h-[30%] p-2 flex flex-col w-full bg-yellow-400">
            {title && (
              <CardTitle className={`h-full w-full break-words text-base font-semibold text-center ${titleSize ? TitleSizeConst[titleSize] : TitleSizeConst.medium} bg-green-500 `}>
                {title}
              </CardTitle>
            )}

            {description && (
              <CardDescription className="w-full text-sm text-muted-foreground break-words bg-blue-400">
                {description}
              </CardDescription>
            )}
          </CardHeader>
        )}

        {children && (
          <CardContent className="p-2 w-full flex-1">
            {children}
          </CardContent>
        )}
      </NewDiv>

      {footer && <CardFooter className="p-2 w-full">{footer}</CardFooter>}
    </Card>
  )
}

export {NewCard}

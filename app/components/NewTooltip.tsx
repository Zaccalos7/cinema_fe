import {Children, isValidElement, useEffect, useRef, useState} from 'react'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '~/components/ui/tooltip'

interface NewTooltipProps {
  children: React.ReactNode | string
  tooltipContent: string | React.ReactNode | null
  maxWidth?: string | number
  asChild?: boolean
}

const DELAY_DURATION_IN_MS = 300

const COMPONENTS_NOT_ALLOWING_TOOLTIP_DISPLAY_NAMES = ['NewCheckbox', 'NewRadio', 'NewSwitch']

const NewTooltip = ({
  children,
  tooltipContent,
  maxWidth = 200,
  asChild = true
}: NewTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const ref = useRef<HTMLButtonElement>(null)

  const CHILDREN = Children.toArray(children)

  if (CHILDREN.length > 0) {
    const firstChild = CHILDREN[0]

    if (isValidElement(firstChild)) {
      const elementType = firstChild?.type as React.ComponentType

      if (typeof elementType !== 'string' && 'displayName' in elementType) {
        const displayName = (elementType as {displayName: string}).displayName

        if (COMPONENTS_NOT_ALLOWING_TOOLTIP_DISPLAY_NAMES.includes(displayName)) {
          return <>You&apos;re not allowed to use a tooltip with {displayName}</>
        }
      }
    }
  }

  const onMouseEnter = () => {
    setTimeout(() => {
      const hovered = ref?.current?.matches(':hover')
      if (hovered) {
        setIsOpen(true)
      }
    }, DELAY_DURATION_IN_MS)
  }

  const onMouseLeave = () => {
    setIsOpen(false)
  }

  const onFocus = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const currentRef = ref?.current

    if (!currentRef) {
      return
    }

    currentRef.addEventListener('mouseenter', onMouseEnter)
    currentRef.addEventListener('mouseleave', onMouseLeave)
    currentRef.addEventListener('focus', onFocus)

    return () => {
      currentRef?.removeEventListener('mouseenter', onMouseEnter)
      currentRef?.removeEventListener('mouseleave', onMouseLeave)
      currentRef?.removeEventListener('focus', onFocus)
    }
  }, [])

  return (
    <TooltipProvider>
      <Tooltip open={tooltipContent ? isOpen : false}>
        <TooltipTrigger asChild={asChild} ref={ref}>
          {typeof children === 'string' ? <p>{children}</p> : children}
        </TooltipTrigger>
        <TooltipContent
          {...{
            ...(typeof tooltipContent === 'string' && {
              style: {
                maxWidth,
                wordWrap: 'break-word',
                whiteSpace: 'normal'
              }
            })
          }}
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export {NewTooltip}

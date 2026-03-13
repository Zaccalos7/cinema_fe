import {useEffect} from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle
} from '~/components/ui/dialog'


import {NewDiv} from './NewDiv'
import { cn } from '~/libs/cn'

interface NextModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onClose?: () => boolean
  onOpen?: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  title?: string
  showClosingButton?: boolean
  contentClassName?: string
  contentStyle?: React.CSSProperties
  grayScaleBackground?: boolean
  interactOutside?: boolean
  interactOutsideToClose?: boolean
  disableEscape?: boolean
  footerClassName?: string
}

const NewModal = ({
  isOpen,
  setIsOpen,
  onClose,
  onOpen,
  children,
  footer,
  title,
  showClosingButton = true,
  contentClassName,
  contentStyle,
  grayScaleBackground = true,
  interactOutside = true,
  interactOutsideToClose,
  disableEscape = false,
  footerClassName = ''
}: NextModalProps) => {
  const computedClassName = cn(contentClassName, 'max-h-[95%] max-w-[95%]')
  useEffect(() => {
    document.body.style.pointerEvents = ''

    if (isOpen) {
      setTimeout(() => {
        onOpen?.()
      })
    }
  }, [isOpen])

  const forceUnmount = true

  if (!isOpen && forceUnmount) {
    return null
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (onClose) {
          const onCloseResult = onClose()
          if (onCloseResult) {
            setIsOpen(!isOpen)
          }
        } else {
          setIsOpen(!isOpen)
        }
      }}
    >
      <DialogOverlay
        {...{
          ...(grayScaleBackground && {className: 'grayscale'})
        }}
      >
        <DialogContent
          data-testid="modal"
          onEscapeKeyDown={(e: KeyboardEvent) => {
            if (disableEscape) {
              e.preventDefault()
              return
            }
            if (onClose) {
              const ok = onClose()
              if (ok) {
                setIsOpen(false)
              }
            } else {
              setIsOpen(false)
            }
          }}
           onOpenAutoFocus={e => {
            e.preventDefault()
          }}
          onInteractOutside={(e: React.PointerEvent<HTMLDivElement>) => {
            const isFocusedOutOfPage = e.type === 'dismissableLayer.focusOutside'

            e.preventDefault()
            if (interactOutsideToClose && interactOutside) {
              if (!isFocusedOutOfPage) {
                if (onClose) {
                  const onCloseResult = onClose()
                  if (onCloseResult) {
                    setIsOpen(false)
                  }
                } else {
                  setIsOpen(false)
                }
              }
            }
          }}
          showClosingButton={showClosingButton}
          className={computedClassName}
          {...{
            ...(contentStyle && {style: contentStyle}),
            ...(!interactOutside && {
              onInteractOutside: (event: React.PointerEvent<HTMLDivElement>) => {
                event.preventDefault()
              }
            })
          }}
        >
          {title && (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
          )}
          <NewDiv  className="h-full w-full mb-auto" align="normal" justify="normal">
            <NewDiv className="h-full w-full px-[1px] py-[1px]">
              {children}
            </NewDiv>
            {footer && (
              <DialogFooter className={cn('pt-6', footerClassName)}>{footer}</DialogFooter>
            )}
          </NewDiv>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  )
}

export {NewModal}

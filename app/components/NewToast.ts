import {type ReactNode} from 'react'
import {toast as sonnerToast} from 'sonner'

const variantsMap = {
  default: 'default',
  destructive: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info'
} as const

type Variant = keyof typeof variantsMap

interface NewUseToastOptions {
  id?: string
  variant?: Variant
  /**
   * in milliseconds
   */
  duration?: number
  title?: string
  description?: ReactNode
  persistent?: boolean
  action?:
    | {
        label: string
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
      }
    | ReactNode
  onDismiss?: () => void
}

const useToast = () => {
  const toast = (options: NewUseToastOptions) => {
    const {variant = 'default', title, description, persistent, action, id, onDismiss} = options

    if (variant === 'default') {
      sonnerToast(title || '', {
        ...(description && {description}),
        ...(persistent && {duration: Infinity}),
        action,
        ...(id && {id}),
        onDismiss,
        ...(options.duration && {duration: options.duration}),
        style: {
          gap: 12
        }
      })
      return
    }

    const methodName = variantsMap[variant]
    const toastMethod = sonnerToast[methodName] || sonnerToast

    toastMethod(title || '', {
      ...(description && {description}),
      ...(persistent && {duration: Infinity}),
      action,
      ...(id && {id}),
      ...(options.duration && {duration: options.duration}),
      onDismiss,
      style: {
        gap: 12
      }
    })
  }

  return {toast, toastDismiss: sonnerToast.dismiss, unstable_genericSonnerToast: sonnerToast}
}

export {useToast}

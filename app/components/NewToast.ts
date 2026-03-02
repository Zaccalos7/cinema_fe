const variantsMap = {
  default: 'default',
  destructive: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info'
} as const

type Variant = keyof typeof variantsMap

import {TooltipProvider} from './ui/tooltip'

interface NewTooltipProps {
  children: React.ReactNode | string
  tooltipContent: string | React.ReactNode | null
  maxWidth?: string | number
  asChild?: boolean
}

const DELAY_DURATION_IN_MS = 300

const NewTooltip = ({children, tooltipContent, maxWidth = 200, asChild}: NewTooltipProps) => {
  return <TooltipProvider children={undefined}></TooltipProvider>
}

export default NewTooltip

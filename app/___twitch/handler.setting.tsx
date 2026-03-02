import {NewDiv, NewRadioButtons, NewTypography} from '~/components'
import { type RadioItem } from '~/components/NewRadioButtons'

const HandlerSetting = () => {

  const options: RadioItem[] = [
    {label: 'Twitch', value: 'twitch', radioIconProps: {iconName: 'twitch', size: 'medium'}},
    {label: 'YouTube', value: 'youtube', radioIconProps: {iconName: 'youtube', size: 'medium'}}
  ]

  return <NewDiv className='w-5/6 h-full'>
    <NewDiv className='h-1/6 w-full items-center justify-center p-2 gap-4' direction='column'>
      <NewTypography variant='h2' >{'Impostazioni Diretta'}</NewTypography>
      <NewRadioButtons options={options} orientation='horizontal' labelClassName='text-xl' defaultValue='twitch'/>
    </NewDiv>

    
  </NewDiv>
}

export default HandlerSetting

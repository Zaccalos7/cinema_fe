import {useState} from 'react'
import {NewButton, NewDiv, NewIcon, NewInput, NewRadioButtons, NewTypography} from '~/components'
import {type RadioItem} from '~/components/NewRadioButtons'

const HandlerSetting = () => {
  const options: RadioItem[] = [
    {label: 'Twitch', value: 'twitch', radioIconProps: {iconName: 'twitch', size: 'medium'}},
    {label: 'YouTube', value: 'youtube', radioIconProps: {iconName: 'youtube', size: 'medium'}}
  ]

  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [streamValues, setStreamValues] = useState({url: '', key: '', stremingPlatform: ''})

  const shouldBePresentAllTheValue = Object.values(streamValues).every(item => item.trim() !== '')

  return (
    <NewDiv className="w-5/6 h-full" direction="column">
      {JSON.stringify({streamValues})}
      <NewDiv className="h-1/6 w-full items-center justify-center p-2 gap-4" direction="column">
        <NewTypography variant="h2">{'Impostazioni Diretta'}</NewTypography>
        <NewRadioButtons
          options={options}
          orientation="horizontal"
          labelClassName="text-xl"
          value={streamValues.stremingPlatform}
          onValueChange={e => setStreamValues(prev => ({...prev, stremingPlatform: e}))}
        />
      </NewDiv>
      <NewDiv className="h-5/6 w-full gap-4 p-4 items-center justify-start" direction="column">
        <NewTypography variant="large" className="text-5xl">
          Url
        </NewTypography>

        <NewDiv className="w-2/3 items-center justify-center">
          <NewInput
            onChange={e =>
              setStreamValues(prev => ({
                ...prev,
                url: e.target.value
              }))
            }
          />
        </NewDiv>

        <NewTypography variant="large" className="text-5xl">
          Stream key
        </NewTypography>

        <NewDiv className="w-2/3 relative">
          <NewInput
            type={isPasswordHidden ? 'password' : 'text'}
            className="w-full pr-10"
            onChange={e =>
              setStreamValues(prev => ({
                ...prev,
                key: e.target.value
              }))
            }
          />

          <NewIcon
            name={isPasswordHidden ? 'eye' : 'eye-closed'}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => {
              setIsPasswordHidden(!isPasswordHidden)
            }}
          />
        </NewDiv>
        <NewDiv className="w-full items-center justify-center gap-16 py-6">
          <NewButton type="button" label="Annulla" variant="secondary" />
          <NewButton type="submit" label="Salva" disabled={!shouldBePresentAllTheValue} />
        </NewDiv>
      </NewDiv>
    </NewDiv>
  )
}

export default HandlerSetting

import {useEffect, useState} from 'react'
import { href, useFetcher } from 'react-router'
import {NewButton, NewDiv, NewIcon, NewInput, NewRadioButtons, NewTypography} from '~/components'
import {type RadioItem} from '~/components/NewRadioButtons'

const HandlerAddSetting = () => {
  const options: RadioItem[] = [
    {label: 'Twitch', value: 'twitch', radioIconProps: {iconName: 'twitch', size: 'medium'}},
    {label: 'YouTube', value: 'youtube', radioIconProps: {iconName: 'youtube', size: 'medium'}}
  ]

  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [streamValues, setStreamValues] = useState({streamUrl: '', streamKey: '', platformStreamName: ''})

  const shouldBePresentAllTheValue = Object.values(streamValues).every(item => item.trim() !== '')

  const addSettingFetcher = useFetcher()

  useEffect(() => {
    if (!addSettingFetcher.data) {
      return
    }

      alert('configurazione salvata')

  }, [addSettingFetcher.data])

  return (
    <NewDiv className="w-full h-full handlerSettingsStyle" direction="column">
      {JSON.stringify({streamValues})}
      <NewDiv className="h-1/6 w-full items-center justify-center p-2 gap-4" direction="column">
        <NewTypography variant="h2">{'Aggiungi Configurazione'}</NewTypography>
        <NewRadioButtons
          className="radioButtonsStyle"
          options={options}
          orientation="horizontal"
          labelClassName="text-xl"
          value={streamValues.platformStreamName}
          onValueChange={e => setStreamValues(prev => ({...prev, platformStreamName: e}))}
        />
      </NewDiv>
      <NewDiv className="h-5/6 w-full gap-4 p-4 items-center justify-start" direction="column">
        <NewTypography variant="large" className="text-5xl">
          streamUrl
        </NewTypography>

        <NewDiv className="w-2/3 items-center justify-center">
          <NewInput
            onChange={e =>
              setStreamValues(prev => ({
                ...prev,
                streamUrl: e.target.value
              }))
            }
          />
        </NewDiv>

        <NewTypography variant="large" className="text-5xl">
          Stream streamKey
        </NewTypography>

        <NewDiv className="w-2/3 relative">
          <NewInput
            type={isPasswordHidden ? 'password' : 'text'}
            className="w-full pr-10"
            onChange={e =>
              setStreamValues(prev => ({
                ...prev,
                streamKey: e.target.value
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
          <NewButton type="submit" label="Salva" disabled={!shouldBePresentAllTheValue} onClick={()=> {
            addSettingFetcher.submit({data: JSON.stringify(streamValues)}, {method: 'POST' , action: href('/twitch/api-setting-save')})
          }}/>
        </NewDiv>
      </NewDiv>
    </NewDiv>
  )
}

export default HandlerAddSetting

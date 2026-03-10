import {NewButton, NewDiv} from '~/components'
import './styles/handlerSettingsStyle.css'
import {Outlet, useNavigate, useNavigation} from 'react-router'

const HandlerSetting = () => {
  const navigate = useNavigate()

  return (
    <NewDiv className="w-5/6 h-full handlerSettingsStyle" direction="column">
      <NewDiv className="h-1/12 w-full items-center justify-around">
        <NewButton
          type="button"
          label="Crea Configurazione"
          className="bg-violet-500"
          iconName="ticket-plus"
          onClick={() => {
            navigate('./addSetting')
          }}
        />
        <NewButton
          type="button"
          label="Le mie Configurazioni"
          className="bg-violet-500"
          iconName="cog"
          onClick={() => {
            navigate('./settingList')
          }}
        />
      </NewDiv>
      <Outlet />
    </NewDiv>
  )
}

export default HandlerSetting

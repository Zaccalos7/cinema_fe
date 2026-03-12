import {Outlet, useNavigate, useNavigation} from 'react-router'
import {NewButton, NewDiv, NewSpinner, NewUILocker} from '~/components'
import {useIsMobile} from '~/hooks/useIsMobile'

const HandleLive = () => {
  const navigate = useNavigate()
  const navigation = useNavigation()

  const {isMobile} = useIsMobile()

  return (
    <NewDiv className="w-full h-full p-4 gap-1 flex flex-row">
      {navigation.state !== 'idle' && <NewUILocker customMessage="Loading..." />}

      <NewDiv
        className={`flex flex-col h-full  ${isMobile ? 'min-w-[90px] max-w-[100px] ' : 'min-w-[250px] max-w-[300px] '}
            items-center justify-start bg-sidebar-foreground bg-indigo-950 border-2 border-violet-950 p-4`}
        bordered
      >
        <NewDiv className="w-full gap-4 p-2 flex flex-col">
          <NewButton
            className="w-full flex items-center justify-start bg-indigo-950 border-2  border-purple-200 "
            type="button"
            label="Gestisci live"
            iconName="list-video"
            fontSize={isMobile ? 'smaller' : 'medium'}
            onClick={() => navigate('./live')}
          />

          <NewButton
            className="w-full flex items-center justify-start bg-indigo-950 border-2 border-purple-200"
            type="button"
            label="Task Manager"
            iconName="monitor-cog"
            fontSize={isMobile ? 'smaller' : 'medium'}
            onClick={() => navigate('./taskManager')}
          />

          <NewButton
            className="w-full flex items-center justify-start bg-indigo-950 border-2 border-purple-200"
            type="button"
            label="Configurazioni"
            iconName="columns-3-cog"
            fontSize={isMobile ? 'smaller' : 'medium'}
            onClick={() => navigate('./configurations')}
          />

          <NewButton
            className="w-full flex items-center justify-start bg-indigo-950 border-2 border-purple-200"
            type="button"
            label="Impostazioni"
            iconName="user-cog"
            fontSize={isMobile ? 'smaller' : 'medium'}
            onClick={() => navigate('./setting')}
          />
        </NewDiv>
      </NewDiv>

      <Outlet />
    </NewDiv>
  )
}

export default HandleLive

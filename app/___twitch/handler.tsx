import {Outlet, useNavigate, useNavigation} from 'react-router'
import {NewButton, NewDiv, NewSpinner, NewUILocker} from '~/components'

const HandleLive = () => {
  const navigate = useNavigate()
  const navigation = useNavigation()

  return (
    <NewDiv className="w-full h-full p-4 gap-1 flex flex-row">
      {navigation.state !== 'idle' && <NewUILocker customMessage="Loading..." />}

      <NewDiv
        className="flex flex-col h-full min-w-[280px] max-w-[300px] items-center justify-start bg-sidebar-foreground bg-indigo-950 border-2 border-violet-950 p-4"
        bordered
      >
        <NewDiv className="w-full gap-4 p-2 flex flex-col">
          <NewButton
            className="w-full flex items-center justify-start bg-indigo-950 border-2 border-purple-200"
            type="button"
            label="Gestisci live"
            iconName="list-video"
            onClick={() => navigate('./live')}
          />

          <NewButton
            className="w-full flex items-center justify-start bg-indigo-950 border-2 border-purple-200"
            type="button"
            label="Task Manager"
            iconName="monitor-cog"
            onClick={() => navigate('./taskManager')}
          />

          <NewButton
            className="w-full flex items-center justify-start bg-indigo-950 border-2 border-purple-200"
            type="button"
            label="Configurazioni"
            iconName="columns-3-cog"
            onClick={() => navigate('./configurations')}
          />

          <NewButton
            className="w-full flex items-center justify-start bg-indigo-950 border-2 border-purple-200"
            type="button"
            label="Impostazioni"
            iconName="user-cog"
            onClick={() => navigate('./setting')}
          />
        </NewDiv>
      </NewDiv>

      <Outlet />
    </NewDiv>
  )
}

export default HandleLive
import {Outlet, useNavigate} from 'react-router'
import {NewButton, NewDiv} from '~/components'

const HandleLive = () => {
  const navigate = useNavigate()

  return (
    <NewDiv className="w-full h-full p-4 gap-1" direction="row">
      <NewDiv
        className="h-full w-1/6 items-center justify-start bg-sidebar-foreground bg-indigo-950 border-2
           border-violet-950 p-4 "
        direction="column"
        bordered
      >
        <NewDiv className="w-full h-full gap-4 p-2" direction="column">
          <NewButton
            className="w-full  bg-indigo-950 border-2 border-purple-200"
            type="button"
            label="Gestisci live"
            iconName="list-video"
            onClick={() => {
              navigate('./live')
            }}
          />
          <NewButton
            className="w-full bg-indigo-950 border-2 border-purple-200"
            type="button"
            label="Task Manager"
            iconName="monitor-cog"
            onClick={() => {
              navigate('./taskManager')
            }}
          />
          <NewButton
            className="w-full bg-indigo-950 border-2 border-purple-200"
            type="button"
            label="Impostazioni"
            iconName="user-cog"
            onClick={() => {
              navigate('./setting')
            }}
          />
        </NewDiv>
      </NewDiv>
      <Outlet />
    </NewDiv>
  )
}

export default HandleLive

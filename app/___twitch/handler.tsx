import {Outlet} from 'react-router'
import {NewButton, NewDiv} from '~/components'

const HandleLive = () => {
  return (
    <NewDiv className="w-full h-full p-4 gap-4">
      <NewDiv
        className="h-full w-1/6 items-center justify-start bg-violet-400 border-2
           border-violet-950 p-4 "
        direction="column"
        bordered
      >
        <NewDiv className="w-full h-full items-center justify-around" direction="column">
          <NewButton
            className="bg-pink-500"
            type="button"
            label="Gestisci live"
            iconName="list-video"
          />
          <NewButton
            className="bg-fuchsia-500"
            type="button"
            label="Task Manager"
            iconName="monitor-cog"
          />
          <NewButton
            className="bg-gray-500"
            type="button"
            label="Impostazioni"
            iconName="user-cog"
          />
        </NewDiv>
      </NewDiv>
      <Outlet />
    </NewDiv>
  )
}

export default HandleLive

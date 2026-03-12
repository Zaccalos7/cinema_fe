import {useState} from 'react'
import {useFetcher} from 'react-router'
import {NewCard, NewDiv, NewSelect} from '~/components'
import './styles/backGround.css'
import { Route } from './+types/handler.configurations'

const BASE_URL = 'http://localhost:1200/settings/retrive'

export const loader = async ({request}: Route.LoaderArgs)=> {
  // const url = new URL(request.url)
  // const searchParams = url.searchParams

  // const streamUrl = searchParams.get('streamUrl') ?? ''
  // const platformStreamName = searchParams.get('platformStreamName') ?? ''
  // const URL_API = `${BASE_URL}?streamUrl=${streamUrl}&platformStreamName=${platformStreamName}`

  console.log('Loader called with URL:', BASE_URL)

  const response = await fetch(BASE_URL)

  console.log('Response from server:', response)
   
  if(!response?.ok) {
    console.error('Error response from server:')
    return
  } 


  const configurationsList = await response.json() ?? []

  console.log('Configurations List:', configurationsList)

  return {
    configurationsList
  }

}

const UserConfigurations = ({loaderData}: Route.ComponentProps) => {
  const retriveConfigurationsFetcher = useFetcher()


  return (
    <NewDiv className="h-full w-full gap-2 handlerSettingsStyle" direction="column">
      {JSON.stringify(loaderData)}
      <NewDiv className="h-5/12 w-1/3 items-center justify-center">
        <NewCard
          title="Twitch Configurations"
          description="Configure your Twitch account and settings."
          width={200}
        >
          ciao
        </NewCard>
      </NewDiv>
    </NewDiv>
  )
}

export default UserConfigurations

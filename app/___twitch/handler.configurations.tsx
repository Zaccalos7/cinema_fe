import {useEffect} from 'react'
import {useFetcher} from 'react-router'
import {useQueryStates, parseAsString} from 'nuqs'
import {NewCard, NewDiv, NewIcon, NewTypography} from '~/components'
import './styles/backGround.css'
import {Route} from './+types/handler.configurations'
import {blue, green, red} from '~/libs/tailwind-colors'

const BASE_URL = 'http://localhost:1200/settings/retrive'

export const loader = async ({request}: Route.LoaderArgs) => {
  // const url = new URL(request.url)
  // const searchParams = url.searchParams

  // const streamUrl = searchParams.get('streamUrl') ?? ''
  // const platformStreamName = searchParams.get('platformStreamName') ?? ''
  // const URL_API = `${BASE_URL}?streamUrl=${streamUrl}&platformStreamName=${platformStreamName}`

  console.log('Loader called with URL:', BASE_URL)

  const response = await fetch(BASE_URL)

  console.log('Response from server:', response)

  if (!response?.ok) {
    console.error('Error response from server:')
    return
  }

  const configurationsList = (await response.json()) ?? []

  console.log('Configurations List:', configurationsList)

  return {
    configurationsList
  }
}

const footerCard = () => {
  return (
    <NewDiv className="w-full h-full items-center justify-around">
      <NewIcon name="book-open-check" tooltip="vedi dettagli" color={green[500]} />
      <NewIcon name="pencil-line" tooltip="modifica" color={blue[500]} />
      <NewIcon name="tv" tooltip="attiva" />
      <NewIcon name="trash-2" tooltip="cancella" color={red[500]} />
    </NewDiv>
  )
}

const UserConfigurations = ({loaderData}: Route.ComponentProps) => {
  const [configurationsFilter, setConfigurationsFilter] = useQueryStates({
    streamUrl: parseAsString.withDefault('').withOptions({shallow: true}),
    platformStreamName: parseAsString.withDefault('').withOptions({shallow: true})
  })

  const configurationsFetcher = useFetcher()

  useEffect(() => {
    if (!configurationsFilter.platformStreamName && !configurationsFilter.streamUrl) {
      return
    }

    configurationsFetcher.submit(
      {
        streamUrl: configurationsFilter.streamUrl,
        platformStreamName: configurationsFilter.platformStreamName
      },
      {method: 'GET'}
    )
  }, [configurationsFilter])

  return (
    <NewDiv className="h-full w-full gap-2 backGround " direction="column">
      <NewDiv className="p-2 h-5/12 w-1/3 items-center justify-center">
        <NewCard
          title={
            <NewDiv
              className="w-full gap-2 items-center justify-center bg-red-500 text-white"
              bordered
            >
              <NewTypography>Youtube</NewTypography>
              <NewIcon name="youtube" />
            </NewDiv>
          }
          description={
            <NewDiv className="w-full items-center justify-center ">
              <NewTypography>Per clicca la donnola</NewTypography>
            </NewDiv>
          }
          width={200}
          footer={footerCard()}
        >
          <NewDiv className="p-2 items-center justify-center">
            <NewTypography asLink>rtm//twitch/tv/mario</NewTypography>
          </NewDiv>
        </NewCard>
      </NewDiv>
    </NewDiv>
  )
}

export default UserConfigurations

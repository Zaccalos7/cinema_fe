import {useEffect, useState} from 'react'
import {useFetcher} from 'react-router'
import {useQueryStates, parseAsString} from 'nuqs'
import {NewCard, NewDiv, NewIcon, NewModal, NewTypography} from '~/components'
import {Route} from './+types/handler.configurations'
import {blue, green, red} from '~/libs/tailwind-colors'
import {SettingRecord} from './types/settingTypes'

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

const FooterCard = (setIsOpen: (value: boolean) => void) => {
  return (
    <NewDiv className="w-full h-full items-center justify-around">
      <NewIcon
        name="book-open-check"
        tooltip="vedi dettagli"
        color={green[500]}
        onClick={() => {
          setIsOpen(true)
        }}
      />
      <NewIcon name="pencil-line" tooltip="modifica" color={blue[500]} />
      <NewIcon name="tv" tooltip="attiva" />
      <NewIcon name="trash-2" tooltip="cancella" color={red[500]} />
    </NewDiv>
  )
}

const CardData = (configuration: SettingRecord) => {
  const {platformStreamName, streamUrl, description} = configuration

  const isYoutube = platformStreamName.toLowerCase().includes('youtube')

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  return (
    <>
      <NewCard
        title={
          <NewDiv
            className={`h-5/12 w-full gap-2 items-center justify-center ${isYoutube ? 'bg-red-500' : 'bg-violet-500'} text-white`}
            bordered
          >
            <NewTypography>{platformStreamName}</NewTypography>
            <NewIcon name={isYoutube ? 'youtube' : 'twitch'} />
          </NewDiv>
        }
        description={
          description && (
            <NewDiv className="h-7/12 w-full  items-center justify-center ">
              <NewTypography>{description}</NewTypography>
            </NewDiv>
          )
        }
        width={250}
        footer={FooterCard(setIsDetailsModalOpen)}
        titleSize="extraLarge"
      >
        <NewDiv className="p-2 items-center justify-center">
          <NewTypography asLink>{streamUrl}</NewTypography>
        </NewDiv>
      </NewCard>

      <NewModal
        isOpen={isDetailsModalOpen}
        setIsOpen={setIsDetailsModalOpen}
        showClosingButton={false}
        interactOutsideToClose
      >
        <NewDiv>ciao</NewDiv>
      </NewModal>
    </>
  )
}

const UserConfigurations = ({loaderData}: Route.ComponentProps) => {
  //@TODO add select for filter configurations
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
    <NewDiv className="h-full w-full flex-wrap gap-2 " direction="column">
      <NewDiv className="p-2 h-5/12 w-full flex flex-wrap items-stretch justify-start gap-4">
        {loaderData?.configurationsList?.map((configuration: SettingRecord) => {
          return (
            <CardData key={configuration.streamUrl + configuration.streamKey} {...configuration} />
          )
        })}
      </NewDiv>
    </NewDiv>
  )
}

export default UserConfigurations

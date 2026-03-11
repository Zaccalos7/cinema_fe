import {useState} from 'react'
import {useFetcher} from 'react-router'
import {NewDiv, NewSelect} from '~/components'

const UserConfigurations = () => {
  const retriveConfigurationsFetcher = useFetcher()

  const options = [
    {
      label: 'pippo',
      value: '2'
    },
    {
      label: 'gino',
      value: '2'
    }
  ]

  return (
    <NewDiv className="h-full w-full">
      <NewSelect options={options} />
    </NewDiv>
  )
}

export default UserConfigurations

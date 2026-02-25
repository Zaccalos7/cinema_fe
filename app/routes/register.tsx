import {useEffect, useState} from 'react'
import {type IconName} from 'types/icons'
import {NewButton, NewDiv, NewIcon, NewInput, NewTypography} from '~/components'
import {black, blue, yellow} from '~/libs/tailwind-colors'
import {cn} from '~/libs/cn'
import {useFetcher} from 'react-router'
import {type Route} from './+types/register'

type UserDataType = {
  nickName: string
  email: string
  password: string
  confirmPassword: string
}

type InputRegisterBlockType = {
  className?: string
  labelClassName?: string
  iconClassName?: string
  label: string
  iconName: IconName
  color?: string
}

const API_URL = 'http://localhost:8080/register'

const CHAR_NOT_FOUND = -1

export const action = async ({request}: Route.ActionArgs) => {
  const formData = await request.formData()

  const intent = formData.get('intent')
  const userData = formData.get('userData') as string

  const userDataParsed = JSON.parse(userData)

  let success = false

  const responseFromValidation = validateFormData(userDataParsed)

  success = responseFromValidation.success

  console.log(success, responseFromValidation.type)

  if (!success) {
    return {
      success,
      message: responseFromValidation.type
    }
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userDataParsed)
  })

  const responseJson = await response.json()

  console.log(responseJson)

  return {
    success
  }
}

const validateFormData = (data: UserDataType) => {
  let response = {type: '', success: true}
  const isNotAValidEmail = data.email.search('@') === CHAR_NOT_FOUND

  if (isNotAValidEmail) {
    response = {type: 'isNotAValidEmail', success: false}
    return response
  }

  const arePasswordsDifferent = data.password !== data.confirmPassword

  if (arePasswordsDifferent) {
    response = {type: 'arePasswordsDifferent', success: false}
    return response
  }

  return response
}

const InputRegisterBlock = ({
  className = '',
  labelClassName = '',
  iconClassName = '',
  label,
  iconName,
  color = black[200]
}: InputRegisterBlockType) => {
  return (
    <NewDiv className={cn(className, 'w-full  items-center justify-center gap-4 px-2')}>
      <NewDiv className={cn(labelClassName, 'w-5/12 items-center justify-center')}>
        <NewTypography variant="body1" bold>
          {label}
        </NewTypography>
      </NewDiv>
      <NewDiv className={cn(iconClassName, 'w-1/12 items-start justify-start ')}>
        <NewIcon name={iconName} color={color} />
      </NewDiv>
    </NewDiv>
  )
}

const Register = () => {
  const [userData, setUserData] = useState<UserDataType>({
    nickName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const arePresentAllUserDataField = Object.values(userData).every(item => item.trim() !== '')

  const registerFetcher = useFetcher()

  useEffect(() => {
    if (!registerFetcher.data) {
      return
    }

    alert('registrato')
  }, [registerFetcher.data])

  return (
    <NewDiv className="h-full w-full items-center justify-center" direction="column">
      <NewDiv className="w-1/3 items center justify-center">
        <NewTypography variant="h3">Benvenuto su ORBIS</NewTypography>
      </NewDiv>
      <NewDiv
        className="w-1/3 h-2/3 items-center justify-center gap-4 px-4 "
        direction="column"
        bordered
      >
        <InputRegisterBlock iconName="user" label="NickName" />

        <NewInput
          value={userData.nickName}
          onChange={e => {
            setUserData(prev => ({...prev, nickName: e.target.value}))
          }}
        />

        <InputRegisterBlock iconName="box" label="Email" color={blue[300]} />

        <NewInput
          value={userData.email}
          onChange={e => {
            setUserData(prev => ({...prev, email: e.target.value}))
          }}
        />

        <InputRegisterBlock iconName="key-round" label="Password" color={yellow[300]} />

        <NewInput
          type="password"
          value={userData.password}
          onChange={e => {
            setUserData(prev => ({...prev, password: e.target.value}))
          }}
        />

        <InputRegisterBlock iconName="key-round" label="Conferma password" color={yellow[300]} />

        <NewInput
          type="password"
          value={userData.confirmPassword}
          onChange={e => {
            setUserData(prev => ({...prev, confirmPassword: e.target.value}))
          }}
        />

        <NewButton
          type="button"
          disabled={!arePresentAllUserDataField}
          label="Entra in Orbis"
          onClick={() => {
            registerFetcher.submit(
              {intent: 'addNewUser', userData: JSON.stringify(userData)},
              {method: 'POST'}
            )
          }}
        />
      </NewDiv>
    </NewDiv>
  )
}

export default Register

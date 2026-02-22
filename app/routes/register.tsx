import {useState} from 'react'
import {type IconName} from 'types/icons'
import {NewDiv, NewIcon, NewInput, NewTypography} from '~/components'
import {black, blue, yellow} from '~/libs/tailwind-colors'
import {cn} from '~/libs/cn'

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
      <NewDiv className={cn(labelClassName, 'w-7/12 items-center justify-center')}>
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

  return (
    <NewDiv className="h-full w-full items-center justify-center" direction="column">
      <NewDiv className="w-1/3 items center justify-center">
        <NewTypography variant="h3">Benvenuto su ORBIS</NewTypography>
      </NewDiv>
      <NewDiv
        className="w-1/3 h-2/3 items-center justify-center gap-4 px-4 bg-pink-500"
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
      </NewDiv>
    </NewDiv>
  )
}

export default Register

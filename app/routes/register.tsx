import {useState} from 'react'
import {type IconName} from 'types/icons'
import {NewDiv, NewIcon, NewInput, NewTypography} from '~/components'
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
}

const InputRegisterBlock = ({
  className = '',
  labelClassName = '',
  iconClassName = '',
  label,
  iconName
}: InputRegisterBlockType) => {
  return (
    <NewDiv className={cn(className, 'w-full  gap-4 px-2')}>
      <NewDiv className={cn(labelClassName, 'w-11/12 items-center justify-center bg-red-500')}>
        <NewTypography bold>{label}</NewTypography>
      </NewDiv>
      <NewDiv className={cn(iconClassName, 'w-1/12 items-start justify-start bg-yellow-50')}>
        <NewIcon name={iconName} />
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
      <NewDiv className="w-1/3 items-center justify-center gap-4 p-2" direction="column" bordered>
        <InputRegisterBlock iconName="user" label="NickName" />
        <NewInput
          value={userData.nickName}
          onChange={value => {
            console.log(value.target.value)
          }}
        />

        <InputRegisterBlock iconName="box" label="Email" />

        <NewInput />

        <InputRegisterBlock iconName="key-round" label="Password" />

        <NewInput />

        <InputRegisterBlock iconName="key-round" label="Conferma password" />

        <NewInput />
      </NewDiv>
    </NewDiv>
  )
}

export default Register

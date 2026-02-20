import {useState} from 'react'
import {NewDiv, NewIcon, NewInput, NewTypography} from '~/components'

type UserDataType = {
  nickName: string
  email: string
  password: string
}

const Register = () => {
  const [userData, setUserData] = useState<UserDataType>({nickName: '', email: '', password: ''})

  return (
    <NewDiv className="h-full w-full items-center justify-center">
      <NewDiv className="w-1/3 items-center justify-center gap-4 p-2 bg-red-600" direction="column">
        <NewDiv className="gap-4 px-2">
          <NewIcon name="user" />
          <NewTypography bold>NickName</NewTypography>
        </NewDiv>

        <NewInput />

        <NewDiv className="gap-4 px-2">
          <NewIcon name="box" />
          <NewTypography bold>Email</NewTypography>
        </NewDiv>

        <NewInput />

        <NewDiv className="gap-4 px-2">
          <NewIcon name="key-round" />
          <NewTypography bold>Password</NewTypography>
        </NewDiv>

        <NewInput />
      </NewDiv>
    </NewDiv>
  )
}

export default Register

import {NewDiv, NewInput} from '~/components'

const LoginPage = () => {
  return (
    <NewDiv
      className="h-full w-full  gap-4 p-2 items-center justify-center bg-orange-400"
      direction="column"
    >
      <NewDiv
        bordered
        className="h-1/2 w-1/3 gap-10 p-2 items-center justify-center bg-black"
        direction="column"
      >
        <NewInput />
        <NewInput />
      </NewDiv>
    </NewDiv>
  )
}

export default LoginPage

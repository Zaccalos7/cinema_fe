import {NewDiv} from '~/components/NewDiv'
import type {Route} from './+types/home'

import {useEffect} from 'react'
import {useToast} from '~/hooks/useToast'

//on mac
const Home = () => {
  const {toast} = useToast()

  useEffect(() => {
    setTimeout(() => {
      toast({
        title: 'ciao',
        variant: 'success'
      })
    })
  }, [])

  return (
    <>
      <NewDiv className="w-full h-full" direction="column"></NewDiv>
    </>
  )
}

export default Home

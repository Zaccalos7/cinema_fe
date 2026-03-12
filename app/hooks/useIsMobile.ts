import {useMediaQuery} from '@react-hook/media-query'

const useIsMobile = () => {
  const isMobile = useMediaQuery('only screen and (max-width: 800px)')
  return {isMobile}
}
export {useIsMobile}

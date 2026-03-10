import {NewDiv} from './NewDiv'
import {NewSpinner} from './NewSpinner'

interface NewUILockerProps {
  showSpinner?: boolean
  customMessage?: string
  isParentRelative?: boolean
}

const NewUILocker = ({showSpinner = true, customMessage, isParentRelative}: NewUILockerProps) => {
  return (
    <div
      className={`${
        isParentRelative ? 'absolute' : 'fixed'
      } top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[51] flex items-center justify-center`}
    >
      <NewDiv className="text-white p-2 gap-2" center align={'start'} justify={'start'}>
        {customMessage && <h1 className="text-xl font-bold animate-pulse">{customMessage}</h1>}
        {showSpinner && <NewSpinner className="mr-2" />}
      </NewDiv>
    </div>
  )
}

export {NewUILocker}

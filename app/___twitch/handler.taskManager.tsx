import {NewDiv, NewIcon, NewTypography} from '~/components'
import {green, pink} from '~/libs/tailwind-colors'
import {Route} from './+types/handler.taskManager'

export const loader = async ({request}: Route.LoaderArgs) => {
  const response = await fetch('http://localhost:1200/taskManager/statistics/cpu')
  const value = await response.json()
  console.log(value)
  return {cpu: value}
}

const colorLevel = (value: number) => {
  if (value <= 20) {
    return 'to-blue-400'
  }

  if (value >= 20 && value <= 50) {
    return 'to-green-400'
  }

  if (value >= 50 && value <= 80) {
    return 'to-yellow-400'
  }

  if (value > 80) {
    return 'to-red-400'
  }
}

const HandlerTaskManager = ({loaderData}: Route.ComponentProps) => {
  const toTransitionsColor = colorLevel(loaderData.cpu)
  return (
    <NewDiv className="h-full w-5/6 flex-wrap items-start justify-start">
      <NewDiv className="h-full w-full flex flex-wrap items-start p-2 gap-4 " direction="column">
        {/* CPU */}
        <NewDiv
          className="h-1/3 w-1/2 bg-indigo-950 border-2 border-violet-950 px-4 py-2 gap-4 flex justify-center items-center"
          bordered
        >
          <NewDiv className="h-2/5 w-1/5 rounded-full flex items-center justify-center bg-indigo-900 ">
            <NewIcon name="brain" size={100} className="animate-pulse" color={pink[300]} />
          </NewDiv>

          <NewDiv className="h-3/5 w-full flex flex-col justify-center gap-3">
            <NewTypography className="text-white text-5xl animate-gradient">CPU</NewTypography>

            <NewTypography className="text-right font-extrabold text-2xl text-zinc-200">
              {loaderData.cpu}%
            </NewTypography>

            <NewDiv className="w-full h-[14px] bg-slate-300 rounded-full overflow-hidden shadow-inner">
              <NewDiv
                className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-400 ${toTransitionsColor}`}
                style={{width: `${loaderData.cpu}%`}}
              />
            </NewDiv>
          </NewDiv>
        </NewDiv>

        {/* RAM */}
        <NewDiv
          className="h-1/3 w-1/2 bg-indigo-950 border-2 border-violet-950 px-4 py-2 gap-4 flex"
          bordered
        >
          <NewDiv className="h-full w-1/5 flex items-center justify-center">
            <NewIcon name="memory-stick" size={120} color={green[300]} className="animate-pulse" />
          </NewDiv>

          <NewDiv className="h-full w-4/5 flex flex-col justify-center gap-3">
            <NewTypography className="text-white text-5xl">RAM</NewTypography>

            <NewTypography className="text-right font-extrabold text-2xl text-zinc-200">
              0%
            </NewTypography>

            <NewDiv className="w-full h-[14px] bg-slate-300 rounded-full overflow-hidden shadow-inner">
              <NewDiv
                className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-emerald-400 to-cyan-300"
                style={{width: '0%'}}
              />
            </NewDiv>
          </NewDiv>
        </NewDiv>

        {/* SWAP */}
        <NewDiv
          className="h-1/3 w-1/2 bg-indigo-950 border-2 border-violet-950 px-4 py-2 gap-4 flex"
          bordered
        >
          <NewDiv className="h-full w-1/5 flex items-center justify-center">
            <NewIcon name="database" size={120} className="animate-pulse" />
          </NewDiv>

          <NewDiv className="h-full w-4/5 flex flex-col justify-center gap-3">
            <NewTypography className="text-white text-5xl">SWAP</NewTypography>

            <NewTypography className="text-right font-extrabold text-2xl text-zinc-200">
              0%
            </NewTypography>

            <NewDiv className="w-full h-[14px] bg-slate-300 rounded-full overflow-hidden shadow-inner">
              <NewDiv
                className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-pink-400 to-yellow-300"
                style={{width: '0%'}}
              />
            </NewDiv>
          </NewDiv>
        </NewDiv>

        {/* TEMP */}
        <NewDiv
          className="h-1/3 w-1/2 bg-indigo-950 border-2 border-violet-950 px-4 py-2 gap-4 flex"
          bordered
        >
          <NewDiv className="h-full w-1/5 flex items-center justify-center">
            <NewIcon name="thermometer" size={120} className="animate-pulse" />
          </NewDiv>

          <NewDiv className="h-full w-4/5 flex flex-col justify-center gap-3">
            <NewTypography className="text-white text-5xl">TEMP</NewTypography>

            <NewTypography className="text-right font-extrabold text-2xl text-zinc-200">
              0°C
            </NewTypography>

            <NewDiv className="w-full h-[14px] bg-slate-300 rounded-full overflow-hidden shadow-inner">
              <NewDiv
                className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-rose-400 to-pink-200"
                style={{width: '0%'}}
              />
            </NewDiv>
          </NewDiv>
        </NewDiv>
      </NewDiv>
    </NewDiv>
  )
}

export default HandlerTaskManager

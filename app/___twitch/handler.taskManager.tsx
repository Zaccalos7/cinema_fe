import {NewDiv, NewIcon, NewTypography} from '~/components'
import {green, orange, pink, violet} from '~/libs/tailwind-colors'
import {Route} from './+types/handler.taskManager'
import {IconName} from 'types/icons'
import {SystemInfoDto} from './types/SystemInfoTypes'
import {useRevalidator} from 'react-router'
import {useEffect} from 'react'

interface InfoCellBlockType {
  iconName: IconName
  cellName: string
  cellValue: number
  iconColor: string
  isAtemperature?: boolean
}

export const loader = async ({request}: Route.LoaderArgs) => {
  const responseAll = await fetch('http://localhost:1200/taskManager/statistics/allInfo')
  const systemInfoList: SystemInfoDto[] = await responseAll.json()

  const cpuInfo = systemInfoList?.[0]
  const ramInfo = systemInfoList?.[1]
  const swapInfo = systemInfoList?.[2]
  const cpuTemperatureInfo = systemInfoList?.[3]

  return {cpuInfo, ramInfo, swapInfo, cpuTemperatureInfo}
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

const InfoCellBlock = ({
  iconName,
  cellName,
  cellValue,
  iconColor,
  isAtemperature = false
}: InfoCellBlockType) => {
  const toTransitionsColor = colorLevel(cellValue)

  return (
    <NewDiv
      className="h-1/3 w-1/2 bg-indigo-950 border-2 border-violet-950 px-4 py-2 gap-4 flex justify-center items-center"
      bordered
    >
      <NewDiv className="h-2/5 w-1/5 rounded-full flex items-center justify-center bg-indigo-900 ">
        <NewIcon name={iconName} size={100} className="animate-pulse" color={iconColor} />
      </NewDiv>

      <NewDiv className="h-3/5 w-full flex flex-col justify-center gap-3">
        <NewTypography className="text-white text-5xl animate-gradient">{cellName}</NewTypography>

        <NewTypography className="text-right font-extrabold text-2xl text-zinc-200">
          {cellValue} {isAtemperature ? '°C' : '%'}
        </NewTypography>

        <NewDiv className="w-full h-20 bg-slate-300 rounded-full overflow-hidden shadow-inner">
          <NewDiv
            className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-400 ${toTransitionsColor}`}
            style={{width: `${cellValue}%`}}
          />
        </NewDiv>
      </NewDiv>
    </NewDiv>
  )
}

const HandlerTaskManager = ({loaderData}: Route.ComponentProps) => {
  const {cpuInfo, ramInfo, swapInfo, cpuTemperatureInfo} = loaderData

  const revalidator = useRevalidator()

  useEffect(() => {
    if (!revalidator) {
      return
    }

    const interval = setInterval(() => {
      revalidator.revalidate()
    }, 5_000)

    return () => clearInterval(interval)
  }, [])

  return (
    <NewDiv className="h-full w-5/6 flex-wrap items-start justify-start">
      <NewDiv className="h-full w-full flex flex-wrap items-start p-2 gap-4 " direction="column">
        <InfoCellBlock
          cellName={cpuInfo.field}
          cellValue={cpuInfo.value}
          iconName="brain"
          iconColor={pink[300]}
        />

        <InfoCellBlock
          cellName={ramInfo.field}
          cellValue={ramInfo.value}
          iconName="memory-stick"
          iconColor={green[300]}
        />

        <InfoCellBlock
          cellName={swapInfo.field}
          cellValue={swapInfo.value}
          iconName="database"
          iconColor={orange[300]}
        />

        <InfoCellBlock
          cellName={cpuTemperatureInfo.field}
          cellValue={cpuTemperatureInfo.value}
          iconName="thermometer"
          iconColor={violet[600]}
          isAtemperature
        />
      </NewDiv>
    </NewDiv>
  )
}

export default HandlerTaskManager

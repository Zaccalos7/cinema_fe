import { type RouteConfig, index } from "@react-router/dev/routes"
import {remixConfigRoutes} from '@react-router/remix-config-routes-adapter'
import colors from 'colors'
import fs from 'fs'
import yaml from 'js-yaml'
import {flatRoutes} from 'remix-flat-routes'

/**
 * this file is called by react twice
 */
declare global {
    var routesLoadCount : number | undefined
}

if(!globalThis.routesLoadCount){
    globalThis.routesLoadCount = 0
}

globalThis.routesLoadCount++

const shouldPrintLog = globalThis.routesLoadCount > 1

type YAMLProjectContent = {
    active: boolean
    locales: string[]
    urlPath?: string
}

const getFilesFromPath = (path:string, extension: string) => {
    const files = fs.readdirSync(path)
    return files.filter(file => file.match(new RegExp(`.*.(${extension})`, 'ig')))
}

const getLists = async ()=>{
    const PROJECTS_LIST : {list: {[key: string]: YAMLProjectContent}} = {list : {}}
    const projectsFiles = [
        ...getFilesFromPath('projects_config', "yaml"),
        ...getFilesFromPath('projects_configs', 'yml')
    ]
    projectsFiles.forEach(file => {
    const project = file.endsWith('.yaml') ? file.replace('.yaml', '') : file.replace('.yml', '')
    const fileRead = fs.readFileSync(`projects_configs/${file}`, 'utf8')
    const content = yaml.load(fileRead) as YAMLProjectContent

    const {active, urlPath, locales} = content

    PROJECTS_LIST['list'][project] = {active, urlPath: urlPath || project, locales}
  })

  return {PROJECTS_LIST}
}

const {PROJECTS_LIST} = await getLists()

let multiBuild = '' //this is for both multi and single build, let's say for builds in general!
try {
  multiBuild = fs.readFileSync('./multiBuild', 'utf8')
} catch {
  shouldPrintLog && console.log(colors.white.bgRed(`\n NO MULTIBUILD SELECTED \n`))
}

const nodeEnv = process.env.NODE_ENV

if (multiBuild && nodeEnv !== 'development') {
  const multiBuildParsed = JSON.parse(multiBuild)
  const newProjectsList: {list: {[key: string]: YAMLProjectContent}} = {list: {}}

  multiBuildParsed.forEach((_project: string) => {
    if (_project) {
      newProjectsList.list[_project] = PROJECTS_LIST.list[_project]
      newProjectsList.list[_project].active = true
    }
  })

  fs.writeFileSync('project.json', JSON.stringify(newProjectsList), 'utf8')
} else {
  if (nodeEnv === 'development') {
    fs.writeFileSync('project.json', JSON.stringify(PROJECTS_LIST), 'utf8')
    fs.rmSync('multiBuild', {
      force: true
    })
  }
}


const projectJSONParsed: {list: {[key: string]: YAMLProjectContent}} = JSON.parse(
  fs.readFileSync('project.json', 'utf8')
)
const {list: projectsList} = projectJSONParsed

const remappedProjects = Object.entries(projectsList || {}).map(([project, {active, urlPath}]) => {
  return {
    folder: `___${project}`,
    urlPath,
    active
  }
})

const main = [
    {
        urlPath : null,
        folder: "routes",
        active: true
    }
]

const routes = remixConfigRoutes(defineRoutes => {
  const mergedRoutes = {}
  
  for(const {urlPath, folder, active} of main){
    if(!active){
        shouldPrintLog && console.log(colors.white.bgCyan(`excluding ${folder}\n`))
        continue
    }
    shouldPrintLog && console.log(colors.white.bgBlue(`including ${folder}\n`))

    const flat = flatRoutes(folder, defineRoutes, {
        ...(urlPath ? {basePath: `/${urlPath}`} : '')
    })

    Object.assign(mergedRoutes, flat)
  }

    for (const {urlPath, folder, active} of remappedProjects) {
      if (!active) {
        shouldPrintLog && console.log(colors.white.bgCyan(`excluding ${folder}\n`))
        continue
      }
      shouldPrintLog && console.log(colors.white.bgBlue(`including ${folder}\n`))
      const flat = flatRoutes(folder, defineRoutes, {
        ...(urlPath ? {basePath: `/${urlPath}`} : {})
      })
      const errors = []

      const routesList = [...Object.values(flat)]
      const rootIndex = routesList.findIndex(route => route.id.split('/')?.at(-1) === '__root')
      const indexIndex = routesList.findIndex(route => route.id.split('/')?.at(-1) === '_index')

      if (rootIndex > -1) {
        routesList[rootIndex] = {
          ...routesList[rootIndex],
          id: routesList[rootIndex].id.replace('/__root', '')
        }
      } else {
        errors.push('Root route not found')
      }

    const parentId = routesList[rootIndex]?.id
    const rootPath = routesList[rootIndex]?.path

    routesList?.forEach((route, ndx) => {
      if (ndx !== rootIndex && ndx !== indexIndex) {
        const splitPath = route?.path?.split('/')

        routesList[ndx] = {
          ...routesList[ndx],
          path: splitPath?.slice(splitPath?.[0] === rootPath ? 1 : 0).join('/'),
          parentId: route?.parentId === 'root' ? parentId : route?.parentId
        }
      }
    })

    if (errors.length > 0) {
      shouldPrintLog && console.log(colors.white.bgRed(`\n ${errors.join('\n')}`))
      shouldPrintLog &&
        console.log(
          colors.white.bgRed(`\n Not including ${folder} as it didn't pass the validation`)
        )

      continue
    }

    const flatCorrected = routesList?.reduce(
      (acc: {[key: string]: (typeof routesList)[0]}, route) => {
        acc[route.id] = route
        return acc
      },
      {} as {[key: string]: (typeof routesList)[0]}
    )

    Object.assign(mergedRoutes, flatCorrected)
  }
 
  return mergedRoutes
})


if (shouldPrintLog) {
  console.log(colors.white.bgMagenta(`*** WARNING ***`))
  console.log(
    colors.white.bgMagenta(
      `If you have this kind of error:\nFATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory \nPlease read the README.md file`
    )
  )
  console.log(colors.white.bgMagenta(`*** WARNING ***\n`))

  const REACT_COMPILER_ENV = Boolean(Number(process.env.REACT_COMPILER))
  const COMPILE_ONLY = process.env.npm_config_compile_only

  if (REACT_COMPILER_ENV) {
    console.log(colors.black.bgGreen(`REACT COMPILER: ON\n`))
    if (COMPILE_ONLY) {
      console.log(colors.black.bgBlue(`COMPILE ONLY: ${COMPILE_ONLY}\n`))
    }
  } else {
    console.log(colors.black.bgYellow(`REACT COMPILER: OFF`))
    console.log(
      colors.black.bgYellow(
        `Please note that in production builds the compiler is ALWAYS ON\nso make sure you run the proper tests on your pages/components \nwith the compiler ON.`
      )
    )
    console.log(colors.black.bgYellow(`To switch it back ON please run: npm run dev \n`))
  }
}


export default routes satisfies RouteConfig

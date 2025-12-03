import { type RouteConfig, index } from "@react-router/dev/routes"
import {remixConfigRoutes} from '@react-router/remix-config-routes-adapter'
import fs from 'fs'

type YAMLProjectContent = {
    active: boolean
    locales: string[]
}

const getFilesFromPath = (path:string, extension: string) => {
    const files = fs.readdirSync(path)
    return files.filter(file => file.match(new RegExp(`.*.(${extension})`, 'ig')))
}

const getLists = async ()=>{
    const PROJECT_LIST : {list: {[key: string]: YAMLProjectContent}} = {list : {}}
    const projectFiles = [
        ...getFilesFromPath('projects_config', "yaml")
    ]
    console.log({projectFiles})
}

const pippo = await getLists()

const routes = remixConfigRoutes(defineRoutes => {
  const mergedRoutes = {}

 
  return mergedRoutes
})

export default routes satisfies RouteConfig

import express from 'express'
import { createServer } from 'https'

import createCookieSessionStorage from './session.server.mjs'

import { createRequestHandler as createRemixRequestHandler } from 'react-router'
import { createRemixRequest, sendRemixResponse } from './DIST_SRV.js'

import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config({ override: false })

let key = null
let cert = null
let ca = null

try {
  key = fs.readFileSync(`${process.cwd()}/cert.key`)
  cert = fs.readFileSync(`${process.cwd()}/cert.crt`)
} catch {
  console.log('No SSL certificate found')
}

if (key && cert) {
  try {
    ca = fs.readFileSync(`${process.cwd()}/ca.crt`)
  } catch {
    console.log('No CA bundle found')
  }
}

let basePath = ''
try {
  basePath = fs.readFileSync(`${process.cwd()}/basePath`, 'utf8')
} catch (e) {
  console.log('No basePath found')
}

let isHttps = key && cert ? true : false
let secureSessionCookieOverride = process.env.SECURE_SESSION_COOKIE_OVERRIDE
if (secureSessionCookieOverride !== undefined) {
  secureSessionCookieOverride = secureSessionCookieOverride === 'true'
  isHttps = secureSessionCookieOverride
}

const sessionStorage = createCookieSessionStorage({
  secure: isHttps
})

const searchFilesAndComponents = (path, stringsToLookFor, isCustomerPage, customer) => {
  const rootPossibleFiles = ['__root', '_index', 'root']
  const possibleExtensions = ['.jsx', '.tsx']

  const pathSplitOnlyValidValues = path.split('/').filter(x => x)
  const firstPath = pathSplitOnlyValidValues[0]

  const baseFolderToLookInto = `app/${isCustomerPage ? `___${customer}` : ''}/`

  const lastPath = pathSplitOnlyValidValues[pathSplitOnlyValidValues.length - 1]

  const isRoot = lastPath === firstPath

  let filesToLookFor = isRoot ? rootPossibleFiles : [lastPath]
  filesToLookFor.forEach(fileToLookFor => {
    possibleExtensions.forEach(ext => {
      filesToLookFor.push(`${fileToLookFor}${ext}`)
    })
  })
  filesToLookFor = filesToLookFor.filter(x => x.includes('.'))
  const report = []

  for (const file of filesToLookFor) {
    const filePath = `${baseFolderToLookInto}${file}`
    try {
      const fileContent = fs.readFileSync(filePath, {
        encoding: 'utf8',
        flag: 'r'
      })
      stringsToLookFor.forEach(stringToLookFor => {
        if (fileContent.includes(stringToLookFor)) {
          //function that looks through the file content and returns an array of numbers which are indexes for the words found

          const getWordsFoundIndexes = (fileContent, stringToLookFor) => {
            const indexes = []
            let i = 0
            while (i < fileContent.length) {
              i = fileContent.indexOf(stringToLookFor, i)
              if (i === -1) {
                break
              }
              indexes.push(i)
              i += stringToLookFor.length
            }
            return indexes
          }

          const indexes = getWordsFoundIndexes(fileContent, stringToLookFor)

          indexes.forEach(index => {
            const occurenceLargerWord = fileContent.substring(
              index - 10,
              index + stringToLookFor.length + 10
            )

            const occurrenceExactWord = fileContent.substring(
              index,
              index + stringToLookFor.length + 1
            )
            const occurrenceExactWordLastCharacter =
              occurrenceExactWord[occurrenceExactWord.length - 1]
            const isOccurenceExactWordLastCharacterALetter =
              occurrenceExactWordLastCharacter.match(/[a-z]/i)

            if (!isOccurenceExactWordLastCharacterALetter) {
              report.push({
                filePath,
                stringToLookFor,
                occurrence: occurenceLargerWord
              })
            }
          })
        }
      })
    } catch (e) {
      //console.log(`File ${filePath} not found`)
    }
  }

  return report
}

const getWhichProjectAndGetAvailableLanguagesForIt = (_, isCustomerPage, customer) => {
  let projectLanguages = []

  if (isCustomerPage) {
    const projectSpecs = fs.readFileSync('./project.json', {
      encoding: 'utf8',
      flag: 'r'
    })

    const parsedProjectSpecs = JSON.parse(projectSpecs)?.list
    const urlPaths = Object.entries(parsedProjectSpecs).map(([key, value]) => {
      return { urlPath: value?.urlPath, customer: key }
    })

    try {
      projectLanguages = [...parsedProjectSpecs[customer]?.locales]
    } catch (e) {
      const correspondingCustomer = urlPaths.find(x => x.urlPath === customer)?.customer
      projectLanguages = [...parsedProjectSpecs[correspondingCustomer]?.locales]
    }
  }
  return {
    allAvailable: !isCustomerPage,
    languages: projectLanguages || []
  }
}

const viteDevServer =
  process.env.NODE_ENV === 'production'
    ? undefined
    : await import('vite').then(vite =>
      vite.createServer({
        server: {
          middlewareMode: true
        }
      })
    )

const app = express()
app.disable('x-powered-by')

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares)
} else {
  app.use(
    '/assets',
    express.static(`build${basePath ? `_${basePath}` : ``}/client/assets`, {
      immutable: true,
      maxAge: '1y'
    })
  )
}
app.use(
  express.static(`build${basePath ? `_${basePath}` : ``}/client`, {
    maxAge: '1h'
  })
)

const formattedTimestamp = () => {
  const now = new Date()
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(now)
}

const originalLog = console.log
console.log = (...args) => {
  originalLog(`[${formattedTimestamp()}]`, ...args)
}

app.use((req, _, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

const createRequestHandler = ({
  build,
  // getLoadContext,
  mode = process.env.NODE_ENV
}) => {
  let handleRequest = createRemixRequestHandler(build, mode)

  return async (req, res, next) => {
    try {
      let session = await sessionStorage.getSession(req.headers.cookie)
      let request = createRemixRequest(req, res)

      let report = []

      const componentsToRemoveInTheFuture = []

      let customer = ''
      const url = req.path

      const splitPathname = url.split('/').filter(x => x)

      const indexToPick = 0
      const splitPathnameLength = splitPathname.length > 0
      let isCustomerPage = false

      const projectSpecs = fs.readFileSync('./project.json', {
        encoding: 'utf8',
        flag: 'r'
      })

      const parsedProjectSpecs = JSON.parse(projectSpecs)?.list
      const urlPaths = Object.entries(parsedProjectSpecs).map(([key, value]) => {
        return { urlPath: value?.urlPath, customer: key }
      })

      const isDevelopment = process.env.NODE_ENV === 'development'

      if (splitPathnameLength) {
        const nameToCheck = splitPathname[indexToPick + (basePath ? 1 : 0) + isDevelopment ? 1 : 0]

        if (nameToCheck in parsedProjectSpecs) {
          isCustomerPage = true
          customer = nameToCheck
        } else {
          const correspondingCustomer = urlPaths.find(x => x.urlPath === nameToCheck)?.customer
          if (correspondingCustomer) {
            isCustomerPage = true
            customer = correspondingCustomer
          }
        }
      }

      if (process.env.NODE_ENV === 'development') {
        const path = req.path
        report = searchFilesAndComponents(
          path,
          ['material/', '@mui/', ...componentsToRemoveInTheFuture],
          isCustomerPage,
          customer
        )
      }

      const routes = viteDevServer ? (await build())?.routes : build?.routes

      let envs = {}
      Object.entries(process.env)
        .filter(([key]) => key.startsWith(`${customer}_`))
        .forEach(([key, value]) => {
          const keyWoCustomer = key.replace(`${customer}_`, '')
          envs[keyWoCustomer] = value
        })

      let loadContext = {
        envs,
        session,
        languages: getWhichProjectAndGetAvailableLanguagesForIt(req, isCustomerPage, customer),
        report,
        routes
      }
      let response = await handleRequest(request, loadContext)
      response.headers.append(
        'Set-Cookie',
        // we have to access our sessionStorage somehow, this is up to you
        await sessionStorage.commitSession(loadContext.session)
      )

      await sendRemixResponse(res, response)
    } catch (e) {
      next(e)
    }
  }
}

app.use((request, res, next) => {
  const pathname = request.path
  const urlSearchParams = new URLSearchParams(request.url.split('?')[1])
  const key = urlSearchParams.get('key')
  let basename = basePath
  if (!basename) {
    basename = 'hydra'
  }
  if (pathname === '/getFile' && key) {
    return res.redirect(307, `./${basename}/api/getFile?key=${key}`)
  } else if (!pathname.startsWith(`/${basename}`)) {
    const stringifiedSearchParams = urlSearchParams.toString()
    return res.redirect(
      307,
      `/${basename}${pathname}${stringifiedSearchParams ? `?${stringifiedSearchParams}` : ''}`
    )
  }

  next()
})

// handle SSR requests
app.all(
  '*',
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule('virtual:react-router/server-build')
      : await import(`./build${basePath ? `_${basePath}` : ``}/server/index.js`)
  })
)

const port = process.env.PORT || 3000

if (isHttps) {
  createServer(
    {
      key,
      cert,
      ...(ca && { ca })
    },
    app
  ).listen(port, () => {
    console.log(`🚀 Running SECURE server (${port} - ${process.env.NODE_ENV})`)
  })
} else {
  app.listen(port, () => {
    console.log(`🚀 Running NON-SECURE server (${port} - ${process.env.NODE_ENV})`)
  })
}


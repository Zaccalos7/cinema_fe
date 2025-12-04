import {input} from '@inquirer/prompts'
import select from '@inquirer/select'
import {spawnSync} from 'child_process'
import colors from 'colors'
import fs, {writeFileSync} from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const currentDir = path.dirname(__filename)

const lastCommitSHA = spawnSync('git rev-parse HEAD', {shell: true, cwd: currentDir})
  .stdout.toString()
  .trim()

const processArguments = process.argv

/**
 *  Load previous saved settings on .builder.json
 */
const loadSettings = () => {
  try {
    const settings = fs.readFileSync(`${currentDir}/.builder.json`, 'utf8')
    return JSON.parse(settings)
  } catch {
    return {
      basePath: 'hydra',
      project: '',
      includeNodeModules: false
    }
  }
}

/**
 * Save settings to .builder.json
 */
const saveSettings = settings => {
  fs.writeFileSync(`${currentDir}/.builder.json`, JSON.stringify(settings))
  return settings
}

const options = processArguments
  .filter(arg => arg.startsWith('--') && arg.split('=')?.[1])
  ?.reduce((acc, curr) => {
    const [key, value] = curr.replace('--', '').split('=')
    acc[key] = value
    return acc
  }, {})

const getBasePathAndProject = async () => {
  console.log(
    `${colors.white.bgBlue(
      ` Customers no longer have the exclamation mark (!) before their url path. `
    )}`
  )
  console.log(`${colors.white.bgBlue(` Have you updated your codebase to reflect this change? `)}`)
  console.log(
    `${colors.white.bgBlue(
      ` Also make sure that every url coming from the previous framework reflect this change `
    )}`
  )
  console.log(
    `${colors.white.bgBlue(
      ` Hardcoded redirects in php files, nginx, apache, etc... have to be replaced as well! `
    )}`
  )

  const previousSettings = loadSettings()

  const basePath =
    options.basepath ||
    (await input({
      message: 'Enter basepath url for the whole app (otherwise leave it empty) e.g. hydra',
      default: previousSettings.basePath
    }))

  const projectsFiles = fs
    .readdirSync(`${currentDir}/projects_configs`)
    ?.filter(
      file =>
        file.match(new RegExp(`.*.(${'yml'})`, 'ig')) ||
        file.match(new RegExp(`.*.(${'yaml'})`, 'ig'))
    )
  const projectsToChooseFrom = []
  projectsFiles.forEach(projectFile => {
    const project = projectFile.endsWith('.yaml')
      ? projectFile.replace('.yaml', '')
      : projectFile.replace('.yml', '')
    const fileRead = fs.readFileSync(`${currentDir}/projects_configs/${projectFile}`, 'utf8')
    const projectConfig = yaml.load(fileRead)

    const isHidden = projectConfig?.hidden

    if (!isHidden) {
      projectsToChooseFrom.push({
        name: project,
        value: project,
        disabled: !projectConfig?.active,
        connections: projectConfig?.connections
      })
    }
  })

  const project =
    options.project === 'no_project'
      ? ''
      : options.project ||
        (await select({
          message: 'Select a project you want to build for',
          choices: [
            ...projectsToChooseFrom.sort(() => Math.random() - 0.5), //almost randomizing so that you read the list
            {
              name: 'No project',
              value: ''
            }
          ],
          default: previousSettings.project
        }))

  const projectConnections = projectsToChooseFrom.find(c => c.value === project)?.connections || []

  let pickedConnections = []

  if (projectConnections.length > 0) {
    if (!options.connections) {
      // pickedConnections = await checkbox({
      //   message: 'Do you also want to multi-build with these connected projects?',
      //   choices: [
      //     ...projectConnections
      //       .filter(x => x !== project)
      //       .map(c => ({ name: c, value: c, checked: true }))
      //   ]
      // })
      pickedConnections = projectConnections
    } else {
      pickedConnections = options.connections.split(',').map(c => c.trim())
    }

    if (pickedConnections.length > 0) {
      pickedConnections.forEach(pickedConnection => {
        if (
          !(
            fs.existsSync(`${currentDir}/projects_configs/${pickedConnection}.yaml`) ||
            fs.existsSync(`${currentDir}/projects_configs/${pickedConnection}.yml`)
          )
        ) {
          console.log(
            `${colors.white.bgRed(
              ` The connection ${pickedConnection} does not exist in the projects_configs folder. `
            )}`
          )
          console.log(`${colors.white.bgRed(` Terminating the build process. `)}`)
          process.exit(1)
        }
      })
    }
  }

  // I want to include node_modules all the time
  const includeNodeModules =
    true ||
    (await select({
      message: 'Install and include node_modules in the build?',
      choices: [
        {name: 'No', value: false},
        {name: 'Yes', value: true}
      ],
      default: previousSettings.includeNodeModules
    }))

  // I want to generate the BUILD.tar.gz all the time
  const generateBuildTgz =
    true ||
    (await select({
      message: 'Generate BUILD.tar.gz?',
      choices: [
        {name: 'No', value: false},
        {name: 'Yes', value: true}
      ],
      default: previousSettings.generateBuildTgz
    }))

  const shouldRemoveComments =
    true ||
    (await select({
      message: 'Remove comments?',
      choices: [
        {name: 'No (recommended)', value: false},
        {name: 'Yes', value: true}
      ],
      default: false //previousSettings.shouldRemoveComments --- I don't want to remember this.
    }))

  return saveSettings({
    basePath,
    project,
    includeNodeModules,
    pickedConnections,
    generateBuildTgz,
    shouldRemoveComments
  })
}

const {
  basePath,
  project,
  includeNodeModules,
  pickedConnections,
  generateBuildTgz,
  shouldRemoveComments
} = await getBasePathAndProject()

if (shouldRemoveComments) {
  process.env.REMOVE_COMMENTS = '1'
}

if (!basePath) {
  //don't remove this check, it is important! (useBasePath wouldn't work anymore)
  throw new Error(`Basepath cannot be empty! IF YOU USED TO USE AN EMPTY BASEPATH,
     NOW YOU HAVE TO CHOOSE ONE AND UPDATE LINKS ON CUSTOMERS END`)
}

const projectsToBuild = [project, ...pickedConnections]

fs.writeFileSync(`${currentDir}/multiBuild`, JSON.stringify(projectsToBuild), 'utf8')

const REACT_COMPILER_ENV = Boolean(Number(process.env.REACT_COMPILER))

console.log('\nREACT COMPILER', REACT_COMPILER_ENV ? 'ON' : 'OFF')
const COMPILE_ONLY = process.env.npm_config_compile_only
if (COMPILE_ONLY) {
  console.log(`\nCOMPILE ONLY IGNORED IN PRODUCTION`)
}

const isGitHubActions = Boolean(process.env.GITHUB_ACTIONS)

const commandsChain = [
  ['npm i', 'Installing dependencies...', false],
  [
    'NODE_OPTIONS=--max_old_space_size=4096 npm run build-core-used-internally-do-not-edit',
    'Building...',
    true,
    'BUILD_COMPLETED_SUCCESFULLY'
  ],
  ['mkdir tmpBuild', 'Creating tmpBuild...'],
  [`cp -R build${basePath ? `_${basePath}` : ''} tmpBuild`, 'Copying build to tmpBuild...'],
  ['cp package.json tmpBuild', 'Copying package.json to tmpBuild...'],
  ['cp server.mjs tmpBuild', 'Copying server.mjs to tmpBuild...'],
  ['cp session.server.mjs tmpBuild', 'Copying session.server.mjs to tmpBuild...'],
  ['cp .npmrc tmpBuild', 'Copying .npmrc to tmpBuild...'],
  ['cp basePath tmpBuild', 'Copying basePath to tmpBuild...'],
  ['cp project.json tmpBuild', 'Copying project.json to tmpBuild...'],
  ['cp DIST_SRV.js tmpBuild', 'Copying DIST_SRV.js to tmpBuild...'],
  [`echo ${lastCommitSHA} >> tmpBuild/.build_metadata`, `Appending .build_metadata`],
  [`echo ${Date.now()} >> tmpBuild/.build_metadata`, `Appending .build_metadata`],
  [`echo ${pickedConnections.join(',')} >> tmpBuild/.build_metadata`, `Appending .build_metadata`],
  isGitHubActions
    ? [`echo "Built via GitHub Actions" >> tmpBuild/.build_metadata`, `Appending .build_metadata`]
    : [`echo "Built locally" >> tmpBuild/.build_metadata`, `Appending .build_metadata`]
]

if (includeNodeModules) {
  commandsChain.push(
    //["mkdir tmpBuild/node_modules", "Creating tmpBuild/node_modules..."],
    //["npm install --prefix tmpBuild", "Installing node_modules in tmpBuild...", true],
    ['cp -R node_modules tmpBuild/', 'Copying node_modules to tmpBuild...', true]
  )
}

//packing tmpBuild in a tar.gz called BUILD.tar.gz
if (generateBuildTgz) {
  commandsChain.push(
    ['tar -czf BUILD.tar.gz -C tmpBuild .', 'Creating BUILD.tar.gz...'],
    [, colors.white.bgGreen(`\n Done! => BUILD.tar.gz\n`)]
  )
}

commandsChain.push(
  ['mv ___* app', 'Manipulating projects folders...'],
  ['rm basePath', 'Removing basePath...'],
  ['rm project', 'Removing project...']
)

commandsChain.push([
  ,
  'You can sync the build via rsync, ie:\n  rsync -avzc --progress tmpBuild/ USER@SERVER:/code/hydra/builds/buildXX/'
])

const runCommand = (command, echo) => {
  echo && console.log(`${echo}`)
  if (!command) {
    return ''
  }
  const {stderr, stdout} = spawnSync(command, {shell: true, cwd: currentDir})
  // const stdoutString = stdout.toString()
  const stderrString = stderr.toString()
  const stdoutString = stdout.toString()
  return {stderr: stderrString, stdout: stdoutString}
}

writeFileSync(`${currentDir}/basePath`, basePath)
writeFileSync(`${currentDir}/project`, project)

console.log('')
// console.log(`Building for project: ${colors.white.bgBlue(` ${project} `)}`)
basePath && console.log(`Basepath: ${colors.white.bgBlue(` ${basePath} `)}`)
console.log('')

// npm run build -- --local=1
const isLocalBuild = options.local === '1'
if (!isLocalBuild) {
  console.log(
    colors.white.bgRed(
      `Building on local machine is no longer supported.\nPlease use the following github action: https://github.com/nextsrlit/hydra/actions/workflows/build.yml `
    )
  )
  console.log('')
  console.log(
    colors.white.bgBlue(
      `If you MUST build on your local machine, you can use the command: npm run build -- --local=1\nPlease don't do it.`
    )
  )
  process.exit(0)
}

runCommand('rm -rf build*', 'Removing previous builds (if present)...')
runCommand('rm -rf BUILD.tar.gz', 'Removing previous BUILD.tar.gz (if present)...')
runCommand('rm -rf tmpBuild', 'Removing previous tmpBuild (if present)...')
projectsToBuild?.forEach(projectToBuild => {
  runCommand(
    `mv app/___${projectToBuild} app/@${projectToBuild}`,
    'Manipulating projects folders...'
  )
})
runCommand('mv app/___* .', 'Manipulating projects folders...')
projectsToBuild?.forEach(projectToBuild => {
  runCommand(
    `mv app/@${projectToBuild} app/___${projectToBuild}`,
    'Manipulating projects folders...'
  )
})

for (const [command, echo, ignoreOutputErrors, expectedOutputToInclude] of commandsChain) {
  const commandOutput = runCommand(command, echo)
  const {stderr: error, stdout: output} = commandOutput

  // console.log({ includes: output?.includes(expectedOutputToInclude), expectedOutputToInclude })
  let passedExpectedOutputToIncludeCheck = true

  if (expectedOutputToInclude) {
    if (!output?.includes(expectedOutputToInclude)) {
      passedExpectedOutputToIncludeCheck = false
    }
  }

  if (!passedExpectedOutputToIncludeCheck) {
    console.log(
      colors.white.bgRed(
        `Expected output to include: ${expectedOutputToInclude} but got: ${output}`
      )
    )
    break
  }

  if (error && !ignoreOutputErrors) {
    console.log(colors.white.bgRed(`\n ${error}`))
    break
  }
}

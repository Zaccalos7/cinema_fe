import { input } from '@inquirer/prompts'
import select from '@inquirer/select'
import { spawnSync } from 'child_process'
import colors from 'colors'
import fs, { writeFileSync } from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const currentDir = path.dirname(__filename)

const lastCommitSHA = spawnSync('git rev-parse HEAD', { shell: true, cwd: currentDir })
  .stdout.toString()
  .trim()

const processArguments = process.argv

const loadSettings = () => {
  try {
    const settings = fs.readFileSync(`${currentDir}/.builder.json`, 'utf8')
    return JSON.parse(settings)
  } catch {
    return { basePath: 'orbis', project: '', includeNodeModules: false }
  }
}

const saveSettings = (settings) => {
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
  console.log(colors.white.bgBlue(` Customers no longer have the exclamation mark (!) before their url path. `))
  console.log(colors.white.bgBlue(` Have you updated your codebase to reflect this change? `))
  console.log(colors.white.bgBlue(` Also make sure that every url coming from the previous framework reflect this change `))
  console.log(colors.white.bgBlue(` Hardcoded redirects in php files, nginx, apache, etc... have to be replaced as well! `))

  const previousSettings = loadSettings()

  const basePath =
    options.basepath ||
    (await input({
      message: 'Enter basepath url for the whole app (otherwise leave it empty) e.g. orbis',
      default: previousSettings.basePath
    }))

  const projectsFiles = fs
    .readdirSync(`${currentDir}/projects_configs`)
    ?.filter(file => file.match(/.*\.(yml|yaml)/i))

  const projectsToChooseFrom = []
  projectsFiles.forEach((projectFile) => {
    const project = projectFile.replace(/\.(yml|yaml)$/i, '')
    const fileRead = fs.readFileSync(`${currentDir}/projects_configs/${projectFile}`, 'utf8')
    const projectConfig = yaml.load(fileRead)

    if (!projectConfig?.hidden) {
      projectsToChooseFrom.push({
        name: project,
        value: project,
        disabled: !projectConfig?.active,
        connections: projectConfig?.connections
      })
    }
  })

  const aliases = []
  if (options.aliases) {
    options.aliases.split(',').forEach(alias => {
      const [prev, next] = alias.split(':').map(s => s.trim())
      aliases.push({ prev, next })
    })
  }

  aliases.forEach(({ prev, next }) => {
    const config = yaml.load(fs.readFileSync(`${currentDir}/projects_configs/${prev}.yaml`, 'utf8'))
    config.urlPath = next
    fs.writeFileSync(`${currentDir}/projects_configs/${prev}.yaml`, yaml.dump(config))
  })

  const project =
    options.project === 'no_project'
      ? ''
      : options.project ||
        (await select({
          message: 'Select a project you want to build for',
          choices: [...projectsToChooseFrom.sort(() => Math.random() - 0.5), { name: 'No project', value: '' }],
          default: previousSettings.project
        }))

  const projectConnections = projectsToChooseFrom.find(c => c.value === project)?.connections || []
  let pickedConnections = []

  if (projectConnections.length > 0) {
    pickedConnections = options.connections
      ? options.connections.split(',').map(c => c.trim())
      : projectConnections

    pickedConnections.forEach(pickedConnection => {
      if (!fs.existsSync(`${currentDir}/projects_configs/${pickedConnection}.yaml`) &&
          !fs.existsSync(`${currentDir}/projects_configs/${pickedConnection}.yml`)) {
        console.log(colors.white.bgRed(` The connection ${pickedConnection} does not exist in the projects_configs folder. `))
        console.log(colors.white.bgRed(` Terminating the build process. `))
        process.exit(1)
      }
    })
  }

  return saveSettings({
    basePath,
    project,
    includeNodeModules: true,
    pickedConnections,
    generateBuildTgz: true,
    shouldRemoveComments: true
  })
}

const { basePath, project, includeNodeModules, pickedConnections, generateBuildTgz, shouldRemoveComments } =
  await getBasePathAndProject()

if (shouldRemoveComments) process.env.REMOVE_COMMENTS = '1'
if (!basePath) throw new Error(`Basepath cannot be empty! Update links on customer end.`)

const projectsToBuild = [project, ...pickedConnections]
fs.writeFileSync(`${currentDir}/multiBuild`, JSON.stringify(projectsToBuild), 'utf8')

const REACT_COMPILER_ENV = Boolean(Number(process.env.REACT_COMPILER))
console.log('\nREACT COMPILER', REACT_COMPILER_ENV ? 'ON' : 'OFF')

const buildFolder = `build${basePath ? `_${basePath}` : ''}`

const commandsChain = [
  ['npm i', 'Installing dependencies...', false],
  ['NODE_OPTIONS=--max_old_space_size=8192 npm run build-core-used-internally-do-not-edit', 'Building...', false],
  ['rm -rf tmpBuild', 'Removing old tmpBuild if exists...', false],
  ['mkdir -p tmpBuild', 'Creating tmpBuild...', false],
  [`mkdir -p ${buildFolder}`, `Creating ${buildFolder} if not exists...`, false],
  [`cp -R ${buildFolder}/. tmpBuild/`, `Copying ${buildFolder} content to tmpBuild...`, false],
  ['cp package.json tmpBuild', 'Copying package.json to tmpBuild...', false],
  ['cp server.mjs tmpBuild', 'Copying server.mjs to tmpBuild...', false],
  ['cp session.server.mjs tmpBuild', 'Copying session.server.mjs to tmpBuild...', false],
  ['cp .npmrc tmpBuild', 'Copying .npmrc to tmpBuild...', false],
  ['cp basePath tmpBuild', 'Copying basePath to tmpBuild...', false],
  ['cp project.json tmpBuild', 'Copying project.json to tmpBuild...', false],
  ['cp DIST_SRV.js tmpBuild', 'Copying DIST_SRV.js to tmpBuild...', false],
  [`echo ${lastCommitSHA} >> tmpBuild/.build_metadata`, `Appending .build_metadata`, false],
  [`echo ${Date.now()} >> tmpBuild/.build_metadata`, `Appending .build_metadata`, false],
  [`echo ${pickedConnections.join(',')} >> tmpBuild/.build_metadata`, `Appending .build_metadata`, false],
  [`echo "Built locally" >> tmpBuild/.build_metadata`, `Appending .build_metadata`, false]
]

if (includeNodeModules) commandsChain.push(['cp -R node_modules tmpBuild/', 'Copying node_modules to tmpBuild...', true])
if (generateBuildTgz) {
  commandsChain.push(['tar -czf BUILD.tar.gz -C tmpBuild .', 'Creating BUILD.tar.gz...', false])
  commandsChain.push([, colors.white.bgGreen(`\n Done! => BUILD.tar.gz\n`)])
}

commandsChain.push(['mv ___* app', 'Manipulating projects folders...', false])
commandsChain.push(['rm basePath', 'Removing basePath...', false])
commandsChain.push(['rm project', 'Removing project...', false])
commandsChain.push([, 'You can sync the build via rsync: rsync -avzc --progress tmpBuild/ USER@SERVER:/code/orbis/builds/buildXX/'])

const runCommand = (command, echo) => {
  if (echo) console.log(echo)
  if (!command) return { stdout: '', stderr: '', status: 0 }
  const result = spawnSync(command, { shell: true, cwd: currentDir, stdio: 'pipe' })
  return { stdout: result.stdout?.toString() || '', stderr: result.stderr?.toString() || '', status: result.status }
}

writeFileSync(`${currentDir}/basePath`, basePath)
writeFileSync(`${currentDir}/project`, project)
console.log(`\nBasepath: ${colors.white.bgBlue(` ${basePath} `)}\n`)

runCommand('rm -rf build*', 'Removing previous builds...')
runCommand('rm -rf BUILD.tar.gz', 'Removing previous BUILD.tar.gz...')
runCommand('rm -rf tmpBuild', 'Removing previous tmpBuild...')

projectsToBuild.forEach(projectToBuild => runCommand(`mv app/___${projectToBuild} app/@${projectToBuild}`, 'Manipulating projects folders...'))
runCommand('mv app/___* .', 'Manipulating projects folders...')
projectsToBuild.forEach(projectToBuild => runCommand(`mv app/@${projectToBuild} app/___${projectToBuild}`, 'Manipulating projects folders...'))

for (const [command, echo, ignoreErrors] of commandsChain) {
  const { stdout, stderr, status } = runCommand(command, echo)
  if (status !== 0 && !ignoreErrors) {
    console.log({ command, stdout, stderr, status })
    console.log(colors.white.bgRed(`\nCommand failed with exit code ${status}`))
    process.exit(status || 1)
  }
}
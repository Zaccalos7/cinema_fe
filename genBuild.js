import { input } from '@inquirer/prompts'
import select from '@inquirer/select'
import { spawnSync } from 'child_process'
import colors from 'colors'
import fs, { writeFileSync } from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import * as tar from 'tar'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const currentDir = path.dirname(__filename)

const removeRecursive = target => {
  if (!fs.existsSync(target)) return
  fs.rmSync(target, { recursive: true, force: true })
}

const removeWildcard = pattern => {
  const prefix = pattern.replace('*', '')
  fs.readdirSync(currentDir)
    .filter(f => f.startsWith(prefix))
    .forEach(f => removeRecursive(path.join(currentDir, f)))
}

const copyRecursive = (src, dest) => {
  if (!fs.existsSync(src)) return
  fs.cpSync(src, dest, { recursive: true })
}

const movePath = (src, dest) => {
  if (!fs.existsSync(src)) return
  fs.renameSync(src, dest)
}

const ensureDir = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const appendToFile = (file, content) => {
  fs.appendFileSync(file, content + '\n')
}

const runCommand = (command, echo) => {
  if (echo) console.log(echo)
  if (!command) return {}

  try {
    if (command.startsWith('rm -rf')) {
      const target = command.replace('rm -rf', '').trim()
      if (target.includes('*')) {
        removeWildcard(target)
      } else {
        removeRecursive(path.join(currentDir, target))
      }
      return {}
    }

    if (command.startsWith('rm ')) {
      const target = command.replace('rm', '').trim()
      removeRecursive(path.join(currentDir, target))
      return {}
    }

    if (command.startsWith('mkdir ')) {
      const dir = command.replace('mkdir', '').trim()
      ensureDir(path.join(currentDir, dir))
      return {}
    }

    if (command.startsWith('cp -R')) {
      const [, src, dest] = command.split(' ')
      copyRecursive(path.join(currentDir, src), path.join(currentDir, dest))
      return {}
    }

    if (command.startsWith('cp ')) {
      const [, src, dest] = command.split(' ')
      copyRecursive(path.join(currentDir, src), path.join(currentDir, dest))
      return {}
    }

    if (command.startsWith('mv ')) {
      const [, src, dest] = command.split(' ')
      if (src.includes('*')) {
        const prefix = src.replace('*', '')
        fs.readdirSync(currentDir)
          .filter(f => f.startsWith(prefix))
          .forEach(file => {
            movePath(path.join(currentDir, file), path.join(currentDir, dest, file))
          })
      } else {
        movePath(path.join(currentDir, src), path.join(currentDir, dest))
      }
      return {}
    }

    if (command.startsWith('echo ') && command.includes('>>')) {
      const match = command.match(/echo (.*) >> (.*)/)
      if (match) {
        const content = match[1].replace(/"/g, '')
        const file = match[2]
        appendToFile(path.join(currentDir, file), content)
      }
      return {}
    }

    if (command.startsWith('tar -czf')) {
      const parts = command.split(' ')
      const fileName = parts[2]
      const cwdIndex = parts.indexOf('-C')
      const cwdFolder = parts[cwdIndex + 1]
      return tar.c(
        { gzip: true, file: path.join(currentDir, fileName), cwd: path.join(currentDir, cwdFolder) },
        ['.']
      )
    }

    if (command.startsWith('NODE_OPTIONS=')) {
      const result = spawnSync('node', [
        '--max_old_space_size=8192',
        path.join(currentDir, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
        'run',
        'build-core-used-internally-do-not-edit'
      ], { cwd: currentDir, stdio: 'pipe' })
      return { stdout: result.stdout?.toString(), stderr: result.stderr?.toString() }
    }

    const { stdout, stderr } = spawnSync(command, { shell: true, cwd: currentDir })
    return { stdout: stdout?.toString(), stderr: stderr?.toString() }

  } catch (err) {
    console.log(colors.white.bgRed(err.message))
    process.exit(1)
  }
}

const lastCommitSHA = spawnSync('git rev-parse HEAD', { shell: true, cwd: currentDir }).stdout.toString().trim()
const processArguments = process.argv

const loadSettings = () => {
  try {
    const settings = fs.readFileSync(`${currentDir}/.builder.json`, 'utf8')
    return JSON.parse(settings)
  } catch {
    return { basePath: 'orbis', project: '', includeNodeModules: false }
  }
}

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
  console.log(colors.white.bgBlue(` Customers no longer have the exclamation mark (!) before their url path. `))
  console.log(colors.white.bgBlue(` Have you updated your codebase to reflect this change? `))
  console.log(colors.white.bgBlue(` Also make sure that every url coming from the previous framework reflect this change `))
  console.log(colors.white.bgBlue(` Hardcoded redirects in php files, nginx, apache, etc... have to be replaced as well! `))

  const previousSettings = loadSettings()

  const basePath = options.basepath || await input({
    message: 'Enter basepath url for the whole app (otherwise leave it empty) e.g. orbis',
    default: previousSettings.basePath
  })

  const projectsFiles = fs.readdirSync(`${currentDir}/projects_configs`)
    ?.filter(file => file.match(/.*\.(yml|yaml)$/i))

  const projectsToChooseFrom = []

  projectsFiles.forEach(projectFile => {
    const project = projectFile.replace(/\.ya?ml$/, '')
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
      const [prev, next] = alias.split(':').map(a => a.trim())
      aliases.push({ prev, next })
    })
  }

  aliases.forEach(({ prev, next }) => {
    const config = yaml.load(fs.readFileSync(`${currentDir}/projects_configs/${prev}.yaml`, 'utf8'))
    config.urlPath = next
    fs.writeFileSync(`${currentDir}/projects_configs/${prev}.yaml`, yaml.dump(config))
  })

  const project = options.project === 'no_project' ? '' :
    options.project || await select({
      message: 'Select a project you want to build for',
      choices: [...projectsToChooseFrom.sort(() => Math.random() - 0.5), { name: 'No project', value: '' }],
      default: previousSettings.project
    })

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

  const includeNodeModules = true
  const generateBuildTgz = true
  const shouldRemoveComments = true

  return saveSettings({ basePath, project, includeNodeModules, pickedConnections, generateBuildTgz, shouldRemoveComments })
}

const { basePath, project, includeNodeModules, pickedConnections, generateBuildTgz, shouldRemoveComments } = await getBasePathAndProject()

if (shouldRemoveComments) process.env.REMOVE_COMMENTS = '1'

if (!basePath) throw new Error(`Basepath cannot be empty! IF YOU USED TO USE AN EMPTY BASEPATH, NOW YOU HAVE TO CHOOSE ONE AND UPDATE LINKS ON CUSTOMERS END`)

const projectsToBuild = [project, ...pickedConnections]
fs.writeFileSync(`${currentDir}/multiBuild`, JSON.stringify(projectsToBuild), 'utf8')

const REACT_COMPILER_ENV = Boolean(Number(process.env.REACT_COMPILER))
console.log('\nREACT COMPILER', REACT_COMPILER_ENV ? 'ON' : 'OFF')
if (process.env.npm_config_compile_only) console.log(`\nCOMPILE ONLY IGNORED IN PRODUCTION`)

const isGitHubActions = Boolean(process.env.GITHUB_ACTIONS)

const commandsChain = [
  ['npm i', 'Installing dependencies...', false],
  ['NODE_OPTIONS=--max_old_space_size=8192 npm run build-core-used-internally-do-not-edit', 'Building...', true, 'BUILD_COMPLETED_SUCCESFULLY'],
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
  isGitHubActions ? [`echo "Built via GitHub Actions" >> tmpBuild/.build_metadata`, `Appending .build_metadata`] : [`echo "Built locally" >> tmpBuild/.build_metadata`, `Appending .build_metadata`]
]

if (includeNodeModules) commandsChain.push(['cp -R node_modules tmpBuild/', 'Copying node_modules to tmpBuild...', true])
if (generateBuildTgz) commandsChain.push(['tar -czf BUILD.tar.gz -C tmpBuild .', 'Creating BUILD.tar.gz...'], [, colors.white.bgGreen(`\n Done! => BUILD.tar.gz\n`)])
commandsChain.push(['mv ___* app', 'Manipulating projects folders...'], ['rm basePath', 'Removing basePath...'], ['rm project', 'Removing project...'])
commandsChain.push([, 'You can sync the build via rsync, ie:\n  rsync -avzc --progress tmpBuild/ USER@SERVER:/code/hydra/builds/buildXX/'])

writeFileSync(`${currentDir}/basePath`, basePath)
writeFileSync(`${currentDir}/project`, project)
console.log('')
basePath && console.log(`Basepath: ${colors.white.bgBlue(` ${basePath} `)}`)
console.log('')

const isLocalBuild = options.local === '1'
if (!isLocalBuild) {
  console.log(colors.white.bgRed(`Building on local machine is no longer supported.\n`))
  console.log('')
  console.log(colors.white.bgBlue(`If you MUST build on your local machine, you can use the command: npm run build -- --local=1\nPlease don't do it.`))
  process.exit(0)
}

runCommand('rm -rf build*', 'Removing previous builds (if present)...')
runCommand('rm -rf BUILD.tar.gz', 'Removing previous BUILD.tar.gz (if present)...')
runCommand('rm -rf tmpBuild', 'Removing previous tmpBuild (if present)...')
projectsToBuild?.forEach(projectToBuild => runCommand(`mv app/___${projectToBuild} app/@${projectToBuild}`, 'Manipulating projects folders...'))
runCommand('mv app/___* .', 'Manipulating projects folders...')
projectsToBuild?.forEach(projectToBuild => runCommand(`mv app/@${projectToBuild} app/___${projectToBuild}`, 'Manipulating projects folders...'))

for (const [command, echo, ignoreOutputErrors, expectedOutputToInclude] of commandsChain) {
  const commandOutput = runCommand(command, echo)
  const { stderr: error, stdout: output } = commandOutput
  let passedExpectedOutputToIncludeCheck = true
  if (expectedOutputToInclude && !output?.includes(expectedOutputToInclude)) passedExpectedOutputToIncludeCheck = false
  if (!passedExpectedOutputToIncludeCheck) {
    console.log(colors.white.bgRed(`Expected output to include: ${expectedOutputToInclude} but got: ${output}`))
    break
  }
  if (error && !ignoreOutputErrors) {
    console.log(colors.white.bgRed(error))
    break
  }
}
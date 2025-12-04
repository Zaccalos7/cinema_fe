import fs from 'fs'
import path from 'path'

const iconsDir = path.resolve(process.cwd(), 'node_modules/lucide-react/dist/esm/icons')

const outputFile = path.resolve('types/icons.d.ts')

const generateIconsTypes = () => {
  const files = fs.readdirSync(iconsDir)

  // Filtra solo i .js, escludendo i .map
  const iconNames = files
    .filter(file => file.endsWith('.js') && !file.endsWith('.js.map'))
    .map(file => path.basename(file, '.js'))
    .sort()

  const typeDef = `// AUTO-GENERATED FILE - DO NOT EDIT
export type IconName =
  ${iconNames.map(name => `"${name}"`).join(' |\n  ')};\n`

  fs.mkdirSync(path.dirname(outputFile), {recursive: true})
  fs.writeFileSync(outputFile, typeDef, 'utf8')

  console.log(`✅ Icon types generated in ${outputFile}`)
}

generateIconsTypes()

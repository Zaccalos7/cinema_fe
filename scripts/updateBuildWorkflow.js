import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

const configsDir = 'projects_configs'
const files = fs.readdirSync(configsDir)

const projects = files
  .filter(file => path.extname(file) !== '')
  .map(file => {
    const filePath = path.join(configsDir, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const config = yaml.load(content)

    if (config.hidden === true) {
      return null
    }

    return path.parse(file).name
  })
  .filter(project => project !== null)
  .sort()

const workflowContent = `name: Hydra Build
run-name: "Hydra Build - \${{ github.event.inputs.project }}"

on:
  workflow_dispatch:
    inputs:
      basepath:
        description: 'Base path for the whole app'
        required: true
        default: 'hydra'
      project:
        description: 'Select project'
        required: true
        type: choice
        options:
          - no_project${projects.map(p => `\n          - ${p}`).join('')}
      connections:
        description: 'Extra connections (comma-separated) If not specified, config declared ones will be used.'
        required: false
        default: ''
      node_version:
        description: 'Node.js version'
        required: true
        type: choice
        default: '22.14.0'
        options:
          - '22.14.0'
          - '20.13.1'


jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '\${{ github.event.inputs.node_version }}'

      - name: Install dependencies
        run: npm install

      - name: Run build script
        run: |
          npm run build -- \\
            --basepath=\${{ github.event.inputs.basepath }} \\
            --project=\${{ github.event.inputs.project }} \\
            --connections=\${{ github.event.inputs.connections }} \\
            --local=1

      - name: Upload build artifact!
        uses: actions/upload-artifact@v4
        with:
          name: hydra-build-\${{ github.event.inputs.project }}-\${{ github.sha }}
          include-hidden-files: true
          path: BUILD.tar.gz
          compression-level: 9
          retention-days: 1
`

fs.writeFileSync('.github/workflows/build.yml', workflowContent)
console.log('Build workflow updated successfully')

import {defineRdtConfig} from 'react-router-devtools'

const customConfig = defineRdtConfig({
  client: {
    position: 'invalid-position',
    defaultOpen: false,
    expansionLevel: 1,
    height: 500,
    minHeight: 300,
    maxHeight: 1000,
    hideUntilHover: false,
    panelLocation: 'bottom',
    requireUrlFlag: false,
    urlFlag: 'devtools',
    routeBoundaryGradient: 'gotham',
    breakpoints: [
      {name: 'lg', min: 0, max: 768},
      {name: 'xl', min: 768, max: 1024},
      {name: '2xl', min: 1024, max: Infinity}
    ],
    showBreakpointIndicator: false
  }
})

export default customConfig

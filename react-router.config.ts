import type { Config } from "@react-router/dev/config";

const DEVELOPMENT_BASENAME = 'orbis'

process.env.BASENAME = DEVELOPMENT_BASENAME

export default {
  routeDiscovery:{
    mode: 'initial'
  },
  appDirectory: 'app',
  basename:`/${DEVELOPMENT_BASENAME}`,
  ssr: true,
  //serverBuildFile: 'index.js'
} satisfies Config;

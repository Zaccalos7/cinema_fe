import type { Config } from "@react-router/dev/config";

const DEVELOPMENT_BASENAME = 'cinema'

process.env.BASENAME = DEVELOPMENT_BASENAME

export default {
  routeDiscovery:{
    mode: 'initial'
  },
  appDirectory: 'app',
  basename:`/${DEVELOPMENT_BASENAME}`,
  ssr: true,
} satisfies Config;

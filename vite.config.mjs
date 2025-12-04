import { reactRouter } from '@react-router/dev/vite'
import reactVitest from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
// /** @type {import('@remix-run/dev').AppConfig} */
import { reactRouterDevTools } from "react-router-devtools"
import babel from 'vite-plugin-babel'
import customConfig from './rdt.config'

const isDevelopment = process.env.NODE_ENV === 'development'
const REACT_COMPILER_ENV = Boolean(Number(process.env.REACT_COMPILER))
const COMPILE_ONLY = isDevelopment ? process.env.npm_config_compile_only : ''
const shouldRemoveComments = Boolean(Number(process.env.REMOVE_COMMENTS))


const ReactCompilerConfig = {
  sources: filename => {
    let shouldCompile = false
    if (isDevelopment) {
      if (COMPILE_ONLY) {
        if (filename.indexOf(`/app/___${COMPILE_ONLY}`) !== -1) {
          shouldCompile = true
        }
      }
      else {
        if (filename.indexOf(`/app`) !== -1) {
          shouldCompile = true
        }
      }
      if (filename.indexOf('/app/routes') !== -1) {
        // we always compile main routes
        shouldCompile = true
      }
    }
    else {
      if (filename.indexOf('/app') !== -1) {
        shouldCompile = true
      }
    }
    return shouldCompile
  }
}

export default defineConfig({
  build: {
    ...shouldRemoveComments && { minify: "esbuild" },
    target: 'esnext',
    // sourcemap: true,
    rollupOptions: {
      onLog: (level, log, handler) => {
        // if (log.cause && log.cause.message === `Can't resolve original location of error.`) {
        //   return
        // }
        handler(level, log)
      }
    }
  },
  ...shouldRemoveComments && {
    esbuild: {
      legalComments: 'none'
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js'
  },
  plugins: [

    babel({
      babelConfig: {
        plugins: [
          ... (REACT_COMPILER_ENV ? [['babel-plugin-react-compiler', ReactCompilerConfig]] : [])
        ],
        presets: ['@babel/preset-typescript'],
        env: {
          development: {
            compact: true
          }
        }
      },
      filter: /\.[jt]sx?$/
    }),
    reactRouterDevTools(customConfig),
    process.env.VITEST ? reactVitest() : reactRouter(),
    tsconfigPaths(),
    svgr({
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: false,
        titleProp: true
      }
    })
  ]
})

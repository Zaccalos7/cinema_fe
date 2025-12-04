// src/vite-env.d.ts
/// <reference types="vite/client" />
/// # <reference types="vite-plugin-svgr/client" />

import '@remix-run/server-runtime'

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    session: {
      get: (key: string) => any
      set: (key: string, value: any) => boolean
      unset: (key: string) => boolean
      has: (key: string) => boolean
      flash: (key: string, value: any) => void
    }
  }
}

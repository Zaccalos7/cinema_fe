import {Outlet, Links, Meta, Scripts, ScrollRestoration} from 'react-router'
import {NuqsAdapter} from 'nuqs/adapters/react-router/v7'
import {Toaster as SonnerToaster} from '~/components/ui/sonner'
import './app.css'
import './globalStyles/toaster.css'
import './mainstyle.css'

export const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <noscript>
          <div>ORBIS: PLEASE ENABLE JAVASCRIPT.</div>
        </noscript>
        <NuqsAdapter>
          <div className="w-screen h-screen flex flex-col">{children}</div>
          <SonnerToaster position="top-center" richColors className="toaster" />
          <ScrollRestoration />
          <Scripts />
        </NuqsAdapter>
      </body>
    </html>
  )
}

const Root = () => {
  return <Outlet />
}

export default Root
